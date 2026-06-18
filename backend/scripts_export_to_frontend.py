"""One-shot exporter: dumps all backend data into the Expo frontend as bundled assets.

Outputs:
  /app/frontend/src/data/stories.json       (all 46 stories + quizzes)
  /app/frontend/src/data/badges.json        (badge defs + levels)
  /app/frontend/src/data/battle_cries.json  (15 cries)
  /app/frontend/src/data/freedom_map.json   (35 map nodes)
  /app/frontend/src/data/hero_visuals.json  (hero meta)
  /app/frontend/assets/portraits/<id>.jpg   (cached portrait bytes from MongoDB)

After this runs, the Expo app no longer needs the backend for any of the above.
"""
import os, sys, json, base64, asyncio
sys.path.insert(0, "/app/backend")
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")

from stories_seed import STORIES, BADGES, LEVELS
from hero_visuals import HERO_VISUALS
from freedom_map import FREEDOM_FIGHTERS, SVG_VIEW_W, SVG_VIEW_H
from battle_cries import BATTLE_CRIES

DATA_OUT = "/app/frontend/src/data"
PORTRAIT_OUT = "/app/frontend/assets/portraits"
os.makedirs(DATA_OUT, exist_ok=True)
os.makedirs(PORTRAIT_OUT, exist_ok=True)


def serialize_story(s):
    # Pick the keys actually used by the frontend
    keep = (
        "id name title_en title_hi tagline_en tagline_hi era color theme region year "
        "story_en story_hi lessons_en lessons_hi quiz".split()
    )
    return {k: s.get(k) for k in keep if k in s}


def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"wrote {path} ({os.path.getsize(path)} bytes)")


def export_static():
    # Stories
    stories = [serialize_story(s) for s in STORIES]
    write_json(f"{DATA_OUT}/stories.json", stories)
    print(f"  → {len(stories)} stories exported")

    # Badges + levels
    write_json(f"{DATA_OUT}/badges.json", {"badges": BADGES, "levels": LEVELS})

    # Hero visuals (color + portrait prompt for reference)
    hv = {k: {"color": v.get("color"), "name": v.get("name")} for k, v in HERO_VISUALS.items()}
    write_json(f"{DATA_OUT}/hero_visuals.json", hv)

    # Freedom map
    map_data = {
        "viewBox": {"w": SVG_VIEW_W, "h": SVG_VIEW_H},
        "fighters": FREEDOM_FIGHTERS,
    }
    write_json(f"{DATA_OUT}/freedom_map.json", map_data)

    # Battle cries
    write_json(f"{DATA_OUT}/battle_cries.json", BATTLE_CRIES)


async def export_portraits():
    """Pull every cached portrait blob from MongoDB → write as local jpg files."""
    from motor.motor_asyncio import AsyncIOMotorClient
    mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
    db_name = os.environ.get("DB_NAME", "azaadi_tales")
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]

    found = 0
    async for doc in db.portraits.find({}):
        sid = doc.get("story_id")
        b64 = doc.get("png_b64")
        if not sid or not b64:
            continue
        ext = "jpg" if (doc.get("mime_type") == "image/jpeg" or doc.get("source") == "pollinations") else "png"
        path = f"{PORTRAIT_OUT}/{sid}.{ext}"
        with open(path, "wb") as f:
            f.write(base64.b64decode(b64))
        found += 1
    print(f"  → {found} portraits exported")
    client.close()


if __name__ == "__main__":
    export_static()
    asyncio.run(export_portraits())
    print("\n✅ Bundle export complete.")
