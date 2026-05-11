"""One-time script to pre-generate AI portraits for all 30 freedom fighters
using the user's own Google Gemini API key (bypasses Emergent LLM budget cap).

Uses the official google-genai SDK with model `gemini-2.5-flash-image-preview`
(Nano Banana). Idempotent: skips heroes already cached.

Usage:  python /app/backend/scripts_generate_portraits.py
"""
import os
import asyncio
import base64
import time
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv("/app/backend/.env")

from google import genai  # noqa: E402
from google.genai import types  # noqa: E402
from hero_visuals import HERO_VISUALS  # noqa: E402

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
GEMINI_KEY = os.environ["GEMINI_API_KEY"]

# Try preview models in order until one works
CANDIDATE_MODELS = [
    "gemini-3.1-flash-image-preview",   # newest fast image model (Nano Banana 3.1)
    "gemini-2.5-flash-image",           # stable Nano Banana 2.5
    "gemini-3-pro-image-preview",       # higher-quality fallback
]


def _gen_image_sync(prompt: str) -> tuple[str, str]:
    """Returns (b64, mime). Uses google-genai SDK directly."""
    client = genai.Client(api_key=GEMINI_KEY)
    last_err = None
    for model in CANDIDATE_MODELS:
        try:
            resp = client.models.generate_content(
                model=model,
                contents=[prompt],
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE", "TEXT"],
                ),
            )
            for part in resp.candidates[0].content.parts:
                if getattr(part, "inline_data", None) and part.inline_data.data:
                    raw = part.inline_data.data
                    mime = part.inline_data.mime_type or "image/png"
                    # SDK returns bytes; encode to b64
                    if isinstance(raw, (bytes, bytearray)):
                        b64 = base64.b64encode(raw).decode("ascii")
                    else:
                        b64 = raw  # already b64 string
                    return b64, mime
            last_err = f"{model}: no inline_data in response"
        except Exception as e:
            last_err = f"{model}: {e}"
            continue
    raise RuntimeError(last_err or "no model worked")


async def gen_one(db, story_id: str, prompt: str) -> str:
    loop = asyncio.get_event_loop()
    b64, mime = await loop.run_in_executor(None, _gen_image_sync, prompt)
    from datetime import datetime, timezone
    await db.portraits.update_one(
        {"story_id": story_id},
        {"$set": {
            "story_id": story_id,
            "png_b64": b64,
            "mime_type": mime,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    return f"{len(base64.b64decode(b64))//1024} KB / {mime}"


async def main():
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    todo = []
    for sid, vis in HERO_VISUALS.items():
        if not vis.get("portrait_prompt"):
            continue
        cached = await db.portraits.find_one({"story_id": sid})
        if cached and cached.get("png_b64"):
            print(f"SKIP {sid} (cached)")
            continue
        todo.append((sid, vis["portrait_prompt"]))
    print(f"Need to generate {len(todo)} portraits", flush=True)
    success = 0
    failed = []
    for i, (sid, prompt) in enumerate(todo):
        print(f"[{i+1}/{len(todo)}] generating {sid}...", flush=True)
        for attempt in range(3):
            try:
                info = await gen_one(db, sid, prompt)
                print(f"  ✓ {sid} → {info}", flush=True)
                success += 1
                break
            except Exception as e:
                print(f"  ✗ attempt {attempt+1} for {sid}: {str(e)[:140]}", flush=True)
                await asyncio.sleep(2 * (attempt + 1))
        else:
            failed.append(sid)
        await asyncio.sleep(0.4)  # gentle rate-limit pacing
    client.close()
    print(f"DONE — succeeded={success}/{len(todo)}, failed={failed}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
