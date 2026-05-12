"""One-time script to pre-generate AI portraits for all 30 freedom fighters
using the FREE Pollinations.ai image-generation service (no API key needed).

Pollinations uses Flux Schnell under the hood. Quality is solid, response time
~3-15s per image. Idempotent: skips heroes already cached in MongoDB.

Usage:  python /app/backend/scripts_generate_portraits.py
"""
import os
import asyncio
import base64
import urllib.parse
import httpx
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv("/app/backend/.env")

from hero_visuals import HERO_VISUALS  # noqa: E402

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]

POLLINATIONS_BASE = "https://image.pollinations.ai/prompt/"


async def _gen_image(prompt: str, seed: int = 42) -> tuple[str, str]:
    """Returns (b64, mime). Calls Pollinations.ai (Flux Schnell)."""
    encoded = urllib.parse.quote(prompt, safe="")
    url = (
        f"{POLLINATIONS_BASE}{encoded}"
        f"?width=512&height=512&model=flux&nologo=true&enhance=true&seed={seed}"
    )
    async with httpx.AsyncClient(timeout=httpx.Timeout(180.0, connect=30.0)) as client:
        r = await client.get(url, follow_redirects=True)
        r.raise_for_status()
        ctype = r.headers.get("content-type", "image/jpeg")
        if not ctype.startswith("image/"):
            raise RuntimeError(f"non-image response: {ctype}")
        b64 = base64.b64encode(r.content).decode("ascii")
        return b64, ctype


async def gen_one(db, story_id: str, prompt: str, seed: int) -> str:
    b64, mime = await _gen_image(prompt, seed=seed)
    from datetime import datetime, timezone
    await db.portraits.update_one(
        {"story_id": story_id},
        {"$set": {
            "story_id": story_id,
            "png_b64": b64,
            "mime_type": mime,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "generator": "pollinations.flux",
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
    # Deterministic seed per hero so repeated runs produce same image
    seed_map = {sid: (abs(hash(sid)) % 99999) + 1 for sid, _ in todo}

    for i, (sid, prompt) in enumerate(todo):
        seed = seed_map[sid]
        print(f"[{i+1}/{len(todo)}] generating {sid} (seed={seed})...", flush=True)
        for attempt in range(3):
            try:
                info = await gen_one(db, sid, prompt, seed)
                print(f"  ✓ {sid} → {info}", flush=True)
                success += 1
                break
            except Exception as e:
                print(f"  ✗ attempt {attempt+1} for {sid}: {str(e)[:160]}", flush=True)
                await asyncio.sleep(3 * (attempt + 1))
        else:
            failed.append(sid)
        await asyncio.sleep(0.5)

    client.close()
    print(f"DONE — succeeded={success}/{len(todo)}, failed={failed}", flush=True)


if __name__ == "__main__":
    asyncio.run(main())
