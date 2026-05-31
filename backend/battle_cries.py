"""Battle Cries — famous slogans of 15 freedom fighters.

Each entry maps a hero_id (matches stories_seed.STORIES) to:
  - cry: the slogan in its original language
  - meaning: short English translation/explanation for kids
  - origin: optional context ("Hindi war cry of 1857", etc.)
"""

BATTLE_CRIES = {
    "bhagat-singh": {
        "cry": "Inquilab Zindabad!",
        "meaning": "Long live the revolution!",
        "origin": "Roared in court as he was sentenced",
    },
    "rani-lakshmibai": {
        "cry": "Main apni Jhansi nahi doongi!",
        "meaning": "I will not give up my Jhansi!",
        "origin": "Said before the battle of Jhansi, 1858",
    },
    "subhas-bose": {
        "cry": "Give me blood, I will give you freedom!",
        "meaning": "Sacrifice everything for freedom!",
        "origin": "Spoken to the Indian National Army",
    },
    "mahatma-gandhi": {
        "cry": "Do or Die!",
        "meaning": "We will succeed or give our lives!",
        "origin": "Quit India movement, 1942",
    },
    "tilak": {
        "cry": "Swaraj is my birthright!",
        "meaning": "Self-rule is my right by birth!",
        "origin": "Tilak's famous declaration",
    },
    "chandrashekhar-azad": {
        "cry": "Dushman ki goliyon ka hum saamna karenge!",
        "meaning": "We will face the enemy's bullets!",
        "origin": "Azad's revolutionary promise",
    },
    "lala-lajpat-rai": {
        "cry": "They may crush my body but not my spirit!",
        "meaning": "My will is stronger than any blow!",
        "origin": "Spoken after the lathi charge of 1928",
    },
    "birsa-munda": {
        "cry": "Abua raj ete jana, maharani raj tundu jana!",
        "meaning": "Let OUR rule begin, let the Queen's rule end!",
        "origin": "Birsa's Mundari rallying cry",
    },
    "rani-gaidinliu": {
        "cry": "We will not bow!",
        "meaning": "We will never surrender our culture!",
        "origin": "Rallying cry of the Naga movement",
    },
    "kunwar-singh": {
        "cry": "Har Har Mahadev!",
        "meaning": "Hail Lord Shiva!",
        "origin": "Ancient war cry of brave warriors",
    },
    "ram-prasad-bismil": {
        "cry": "Sarfaroshi ki tamanna ab hamare dil mein hai!",
        "meaning": "The desire to give our life burns in our heart!",
        "origin": "From Bismil's famous poem",
    },
    "kittur-chennamma": {
        "cry": "Fight for your motherland!",
        "meaning": "Defend the land that gave you life!",
        "origin": "Chennamma's call before battle, 1824",
    },
    "kattabomman": {
        "cry": "I will not surrender!",
        "meaning": "I will never bow to invaders!",
        "origin": "Said to the British Collector",
    },
    "matangini-hazra": {
        "cry": "Vande Mataram!",
        "meaning": "I bow to thee, Mother India!",
        "origin": "Her last words while holding the tricolor",
    },
    "sarojini-naidu": {
        "cry": "Vande Mataram!",
        "meaning": "I bow to thee, Mother India!",
        "origin": "The freedom struggle's most loved chant",
    },
}

BATTLE_CRY_BADGE_PREFIX = "cry_"  # e.g., "cry_bhagat-singh"
BATTLE_CRY_XP_PER_COMPLETION = 10
FREEDOM_VOICE_BADGE = "freedom_voice"
FREEDOM_VOICE_THRESHOLD = 5  # cries needed to unlock the mega-badge


def has_cry(hero_id: str) -> bool:
    return hero_id in BATTLE_CRIES


def get_cry(hero_id: str):
    return BATTLE_CRIES.get(hero_id)


def all_cries() -> list:
    """Return a list of {hero_id, cry, meaning, origin}."""
    return [{"hero_id": hid, **data} for hid, data in BATTLE_CRIES.items()]
