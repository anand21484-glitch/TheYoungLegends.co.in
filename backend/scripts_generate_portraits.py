"""One-time script to pre-generate AI portraits for all 30 freedom fighters
and cache them in MongoDB. Idempotent: skips heroes already cached.

Usage:  python /app/backend/scripts_generate_portraits.py
"""
import os
import asyncio
import base64
import time
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv("/app/backend/.env")

from emergentintegrations.llm.chat import LlmChat, UserMessage  # noqa: E402
from hero_visuals import HERO_VISUALS  # noqa: E402

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ["EMERGENT_LLM_KEY"]


async def gen_one(db, story_id: str, prompt: str) -> str:
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=f"portrait-{story_id}-{int(time.time())}",
        system_message="You are an artist making warm illustrated portraits for a children's history app.",
    ).with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
    msg = UserMessage(text=prompt)
    _txt, images = await chat.send_message_multimodal_response(msg)
    if not images:
        raise RuntimeError("no image returned")
    img = images[0]
    b64 = img["data"]
    mime = img.get("mime_type", "image/png")
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
    print(f"Need to generate {len(todo)} portraits")
    for i, (sid, prompt) in enumerate(todo):
        print(f"[{i+1}/{len(todo)}] generating {sid}...", flush=True)
        for attempt in range(3):
            try:
                info = await gen_one(db, sid, prompt)
                print(f"  ✓ {sid} → {info}")
                break
            except Exception as e:
                print(f"  ✗ attempt {attempt+1} for {sid}: {e}")
                await asyncio.sleep(2 * (attempt + 1))
        # tiny pause to avoid rate-limit
        await asyncio.sleep(0.5)
    client.close()
    print("DONE")


if __name__ == "__main__":
    asyncio.run(main())
