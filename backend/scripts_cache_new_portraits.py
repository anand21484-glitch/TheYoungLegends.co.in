"""One-shot script to pre-cache portraits for the 16 new heroes via Pollinations.ai.
Stores base64 PNG bytes in db.portraits so the existing /stories/{id}/portrait endpoint
serves them instantly from cache (no Gemini budget burn).
"""
import asyncio, os, base64, sys
from datetime import datetime, timezone

import httpx
from urllib.parse import quote
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(__file__))
from hero_visuals import HERO_VISUALS

NEW_HERO_IDS = [
    "ram-prasad-bismil", "ashfaqulla-khan", "kunwar-singh", "tara-rani-srivastava",
    "aurobindo-ghosh", "veer-surendra-sai", "bhima-bhoi", "uyyalawada-narasimha-reddy",
    "abbakka-chowta", "pazhassi-raja", "kattabomman", "puli-thevar",
    "kanaklata-barua", "kushal-konwar", "tirot-sing", "rani-gaidinliu",
]


async def cache_one(db, hero_id: str) -> str:
    existing = await db.portraits.find_one({"story_id": hero_id})
    if existing and existing.get("png_b64") and len(existing["png_b64"]) > 500:
        return "cached-already"

    vis = HERO_VISUALS.get(hero_id)
    if not vis:
        return "NO-VISUAL"
    prompt = vis["portrait_prompt"]
    seed = abs(hash(hero_id)) % 100000
    url = (
        f"https://image.pollinations.ai/prompt/{quote(prompt)}"
        f"?width=512&height=512&nologo=true&seed={seed}"
    )
    try:
        async with httpx.AsyncClient(timeout=90.0, follow_redirects=True) as cli:
            r = await cli.get(url)
            r.raise_for_status()
            png = r.content
            if not png or len(png) < 2000:
                return f"empty-image ({len(png)} bytes)"
            await db.portraits.update_one(
                {"story_id": hero_id},
                {"$set": {
                    "story_id": hero_id,
                    "png_b64": base64.b64encode(png).decode(),
                    "mime_type": "image/jpeg",
                    "source": "pollinations",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }},
                upsert=True,
            )
            return f"OK ({len(png)//1024}KB)"
    except Exception as e:
        return f"FAIL: {type(e).__name__}: {e}"


async def main():
    load_dotenv()
    cli = AsyncIOMotorClient(os.environ["MONGO_URL"])
    db = cli[os.environ["DB_NAME"]]
    print(f"Pre-caching {len(NEW_HERO_IDS)} portraits via Pollinations.ai…\n")
    # Sequential to be gentle on the free service, with small jitter
    for hid in NEW_HERO_IDS:
        status = await cache_one(db, hid)
        print(f"  {hid:35} {status}")
        await asyncio.sleep(1.0)
    print("\nDone.")


if __name__ == "__main__":
    asyncio.run(main())
