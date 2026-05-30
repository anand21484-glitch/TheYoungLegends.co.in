"""Freedom Map of India — 35 freedom fighters with state + lat/lon for map placement.

For each hero we store:
  - hero_id: matches an existing story id (in stories_seed*) when has_story=True
  - name: display name
  - state: home region/state in India
  - lat, lon: geographic coordinates (used to project onto India SVG viewBox 612x696)
  - short_line: one short exciting sentence for kids 6-10
  - has_story: True if a story exists in the app (Meet button -> /story/<id>)

The SVG viewBox is 612 x 696. India spans roughly:
  longitude 68°E -> 97°E (29° wide  -> x = (lon-68)/29 * 612)
  latitude   8°N -> 37°N (29° tall  -> y = (37-lat)/29 * 696)
For multiple heroes in the same state we apply a small per-hero (dx,dy)
offset so dots don't overlap.
"""

from typing import List, Dict, Tuple

# Bounding box for the simple equirectangular projection used by the SVG
SVG_VIEW_W = 612
SVG_VIEW_H = 696
LON_MIN, LON_MAX = 68.0, 97.0   # 29° wide
LAT_MIN, LAT_MAX = 8.0, 37.0    # 29° tall

def latlon_to_xy(lat: float, lon: float) -> Tuple[float, float]:
    x = (lon - LON_MIN) / (LON_MAX - LON_MIN) * SVG_VIEW_W
    y = (LAT_MAX - lat) / (LAT_MAX - LAT_MIN) * SVG_VIEW_H
    return (round(x, 1), round(y, 1))


# Raw freedom-fighter data with offsets (dx,dy) in SVG units for clustering
# Existing story ids verified against stories_seed*: bhagat-singh, rani-lakshmibai,
# subhas-bose, mahatma-gandhi, tilak, mangal-pandey, tantia-tope, alluri-sitarama-raju,
# chandrashekhar-azad, sarojini-naidu, lala-lajpat-rai, sukhdev, rajguru, bipin-pal,
# veer-savarkar, birsa-munda, matangini-hazra, begum-hazrat-mahal, kittur-chennamma
FREEDOM_FIGHTERS = [
    # (hero_id, name, state, lat, lon, short_line, dx, dy, story_id_or_None)
    ("bhagat-singh", "Bhagat Singh", "Punjab", 31.0, 75.5,
        "He was only 23 and feared NOTHING!", -8, -8, "bhagat-singh"),
    ("sukhdev", "Sukhdev Thapar", "Punjab", 30.7, 76.0,
        "Bhagat Singh's best friend and brave partner.", 14, 10, "sukhdev"),

    ("lala-lajpat-rai", "Lala Lajpat Rai", "Haryana", 29.0, 76.0,
        "The 'Lion of Punjab' who roared at the British!", 0, 0, "lala-lajpat-rai"),

    ("rani-lakshmibai", "Rani Lakshmibai", "Jhansi, UP", 25.5, 78.6,
        "A queen who fought like a warrior — sword in hand!", -10, -6, "rani-lakshmibai"),
    ("ram-prasad-bismil", "Ram Prasad Bismil", "Uttar Pradesh", 27.0, 80.5,
        "A poet whose words shook an empire.", 8, -10, "ram-prasad-bismil"),
    ("ashfaqulla-khan", "Ashfaqulla Khan", "Uttar Pradesh", 26.5, 80.0,
        "Best friends with Bismil — they fought side by side!", 18, 2, "ashfaqulla-khan"),
    ("begum-hazrat-mahal", "Begum Hazrat Mahal", "Lucknow, UP", 26.85, 80.95,
        "A queen who led an entire army against the British!", -2, 14, "begum-hazrat-mahal"),

    ("chandrashekhar-azad", "Chandrashekhar Azad", "Madhya Pradesh", 24.0, 78.0,
        "He promised: 'I will NEVER be captured alive!'", -8, -10, "chandrashekhar-azad"),
    ("tantia-tope", "Tantia Tope", "Madhya Pradesh", 23.5, 78.5,
        "A master strategist of the 1857 uprising!", 12, 8, "tantia-tope"),

    ("kunwar-singh", "Kunwar Singh", "Bihar", 25.5, 84.7,
        "Eighty years old and STILL fighting for freedom!", -6, 0, "kunwar-singh"),
    ("tara-rani-srivastava", "Tara Rani Srivastava", "Bihar", 25.7, 85.2,
        "She carried the tricolor even after her husband fell.", 10, 12, "tara-rani-srivastava"),

    ("subhas-bose", "Subhas Chandra Bose", "West Bengal", 22.6, 88.4,
        "'Give me blood, and I shall give you freedom!'", -10, -10, "subhas-bose"),
    ("mangal-pandey", "Mangal Pandey", "Barrackpore, WB", 22.78, 88.36,
        "The spark that lit the 1857 freedom fire!", 12, -6, "mangal-pandey"),
    ("bipin-pal", "Bipin Chandra Pal", "West Bengal", 22.9, 88.6,
        "Part of the famous 'Lal-Bal-Pal' trio!", 18, 8, "bipin-pal"),
    ("aurobindo-ghosh", "Aurobindo Ghosh", "West Bengal", 22.4, 88.2,
        "A scholar, poet, and freedom fighter!", -16, 12, "aurobindo-ghosh"),
    ("matangini-hazra", "Matangini Hazra", "West Bengal", 22.1, 87.8,
        "She marched holding our flag until her last breath.", -22, 24, "matangini-hazra"),

    ("birsa-munda", "Birsa Munda", "Jharkhand", 23.5, 85.5,
        "A tribal hero who became a god to his people!", 0, 0, "birsa-munda"),

    ("veer-surendra-sai", "Veer Surendra Sai", "Odisha", 21.5, 84.0,
        "Spent 37 years in jail and never gave up!", -6, -8, "veer-surendra-sai"),
    ("bhima-bhoi", "Bhima Bhoi", "Odisha", 20.5, 84.5,
        "A blind poet whose songs woke up a nation.", 10, 10, "bhima-bhoi"),

    ("mahatma-gandhi", "Mahatma Gandhi", "Gujarat", 22.5, 71.5,
        "He defeated an empire with peace and a smile.", 0, 0, "mahatma-gandhi"),

    ("tilak", "Bal Gangadhar Tilak", "Maharashtra", 19.0, 73.5,
        "He said: 'Freedom is my birthright — and I shall have it!'", -10, -8, "tilak"),
    ("rajguru", "Shivaram Rajguru", "Maharashtra", 18.7, 74.0,
        "A sharp-shooter with nerves of steel!", 14, 6, "rajguru"),
    ("veer-savarkar", "V. D. Savarkar", "Maharashtra", 18.5, 73.0,
        "He swam an OCEAN trying to escape British captivity!", -18, 16, "veer-savarkar"),

    ("alluri-sitarama-raju", "Alluri Sitarama Raju", "Andhra Pradesh", 17.5, 82.5,
        "A jungle warrior who fought with bow and arrow!", -10, -4, "alluri-sitarama-raju"),
    ("uyyalawada-narasimha-reddy", "Uyyalawada Narasimha Reddy", "Andhra Pradesh", 15.5, 78.5,
        "He rebelled against the British 60 years before 1857!", 8, 14, "uyyalawada-narasimha-reddy"),

    ("sarojini-naidu", "Sarojini Naidu", "Telangana", 17.4, 78.5,
        "India's 'Nightingale' — poet AND freedom fighter!", 0, 0, "sarojini-naidu"),

    ("kittur-chennamma", "Kittur Chennamma", "Karnataka", 15.5, 74.8,
        "A warrior queen who refused to bow to British rule!", -10, -8, "kittur-chennamma"),
    ("abbakka-chowta", "Abbakka Chowta", "Karnataka", 13.0, 74.8,
        "She defended her city for over 40 years!", 8, 12, "abbakka-chowta"),

    ("pazhassi-raja", "Pazhassi Raja", "Kerala", 11.5, 75.5,
        "The 'Lion of Kerala' who fought from the forests!", 0, 0, "pazhassi-raja"),

    ("kattabomman", "Veerapandiya Kattabomman", "Tamil Nadu", 9.0, 77.7,
        "A fearless chieftain who said NO to British taxes!", -6, -10, "kattabomman"),
    ("puli-thevar", "Puli Thevar", "Tamil Nadu", 8.7, 77.4,
        "One of the FIRST kings to fight the British!", 10, 10, "puli-thevar"),

    ("kanaklata-barua", "Kanaklata Barua", "Assam", 26.5, 92.5,
        "Only 17 years old when she carried the flag — bravely!", -6, -8, "kanaklata-barua"),
    ("kushal-konwar", "Kushal Konwar", "Assam", 26.8, 93.5,
        "He gave his life for the Quit India movement.", 10, 8, "kushal-konwar"),

    ("tirot-sing", "U Tirot Sing", "Meghalaya", 25.5, 91.5,
        "A tribal chief who battled the British in the hills!", 0, 0, "tirot-sing"),

    ("rani-gaidinliu", "Rani Gaidinliu", "Manipur/Nagaland", 25.5, 94.0,
        "She started leading her people at just 13 years old!", 0, 0, "rani-gaidinliu"),
]


def get_freedom_map_data() -> List[Dict]:
    """Return the enriched list with computed (x,y) for SVG placement."""
    out = []
    for tup in FREEDOM_FIGHTERS:
        hero_id, name, state, lat, lon, line, dx, dy, story_id = tup
        bx, by = latlon_to_xy(lat, lon)
        out.append({
            "hero_id": hero_id,
            "name": name,
            "state": state,
            "x": round(bx + dx, 1),
            "y": round(by + dy, 1),
            "lat": lat,
            "lon": lon,
            "short_line": line,
            "has_story": story_id is not None,
            "story_id": story_id,
        })
    return out


FREEDOM_MAP_TOTAL = len(FREEDOM_FIGHTERS)
FREEDOM_MAP_BADGE = "map_explorer"
FREEDOM_MAP_XP_PER_DISCOVERY = 5
