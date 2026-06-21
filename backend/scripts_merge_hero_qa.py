"""Merge the user-uploaded hero Q&A files, normalize IDs to match story IDs,
and emit a single bundle that the frontend loads.

Outputs: /app/frontend/src/data/hero_qa.json
"""
import json
from pathlib import Path

# Manual ID mapping where the user's underscore IDs differ from my story IDs.
# Anything not in this map is auto-normalized: underscores → hyphens.
MANUAL_ID_MAP = {
    "subhas_chandra_bose": "subhas-bose",
    "bal_gangadhar_tilak": "tilak",
    "u_tirot_sing": "tirot-sing",
    "ashfaqullah_khan": "ashfaqulla-khan",
    "sukhdev_thapar": "sukhdev",
    "veerapandiya_kattabomman": "kattabomman",
    "vinayak_damodar_savarkar": "veer-savarkar",
    "bipin_chandra_pal": "bipin-pal",
    "subramanya_bharati": "subramania-bharati",
    "tantia_bhil": "tilka-manjhi",  # tilka-manjhi is the closest match; otherwise drop
}

# Heroes in the user file that have NO matching story → flagged but kept aside.
NO_STORY = []

def normalize_id(uid: str) -> str:
    if uid in MANUAL_ID_MAP:
        return MANUAL_ID_MAP[uid]
    return uid.replace("_", "-")

def load(p):
    with open(p) as f:
        return json.load(f)

f1 = load("/tmp/heroes_qa_1.json")
f2 = load("/tmp/heroes_qa_2.json")
f3 = load("/tmp/heroes_qa_3.json")
combined = {**f1, **f2, **f3}
print(f"Loaded {len(f1)} + {len(f2)} + {len(f3)} = {len(combined)} hero entries\n")

# Load my story IDs for matching
with open("/app/frontend/src/data/stories.json") as f:
    stories = json.load(f)
story_ids = {s["id"] for s in stories}
print(f"Story IDs available: {len(story_ids)}")

# Build the normalized output
output = {}
unmatched = []
for uid, payload in combined.items():
    sid = normalize_id(uid)
    if sid in story_ids:
        output[sid] = {
            "name": payload.get("name"),
            "questions": payload.get("questions", []),
        }
    else:
        unmatched.append((uid, sid))

# Report coverage
covered = set(output.keys())
missing_in_qa = story_ids - covered
print(f"\n✅ MATCHED: {len(covered)} / {len(story_ids)} stories have Q&A")
print(f"❌ STORIES WITH NO Q&A YET ({len(missing_in_qa)}):")
for s in sorted(missing_in_qa):
    print(f"  - {s}")

print(f"\n⚠️  Q&A IN FILE BUT NO MATCHING STORY ({len(unmatched)}):")
for uid, sid in unmatched:
    print(f"  - {uid}  →  normalized to '{sid}' (not in stories)")

# Save bundle
out_path = "/app/frontend/src/data/hero_qa.json"
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
print(f"\n📦 Wrote {out_path} ({Path(out_path).stat().st_size:,} bytes)")
