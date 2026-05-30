"""Backend tests for Azaadi Tales — Freedom Map of India endpoints."""
import sys
import requests
from pymongo import MongoClient

BACKEND_URL = "https://azaadi-stories.preview.emergentagent.com/api"
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "azaadi_tales"

USERNAME = "testkid"
PASSWORD = "abcd"

results = []


def record(name, passed, detail=""):
    results.append((name, passed, detail))
    print(f"{'PASS' if passed else 'FAIL'} | {name}" + (f" | {detail}" if detail else ""))


def reset_testkid():
    mc = MongoClient(MONGO_URL)
    db = mc[DB_NAME]
    u = db.users.find_one({"username": USERNAME})
    if not u:
        print(f"WARN: {USERNAME} not found in DB, cannot reset")
        return None
    badges = [b for b in (u.get("badges") or []) if b != "map_explorer"]
    db.users.update_one(
        {"username": USERNAME},
        {"$set": {"discovered_heroes": [], "badges": badges}},
    )
    fresh = db.users.find_one({"username": USERNAME})
    mc.close()
    print(f"Reset {USERNAME}: discovered_heroes=[], badges={fresh.get('badges')}, xp={fresh.get('xp')}")
    return fresh


def login():
    r = requests.post(f"{BACKEND_URL}/auth/login", json={"username": USERNAME, "password": PASSWORD}, timeout=30)
    assert r.status_code == 200, f"login {r.status_code} {r.text}"
    data = r.json()
    return data["token"], data["user"]


def auth_headers(tok):
    return {"Authorization": f"Bearer {tok}"}


def test_login():
    try:
        tok, user = login()
        record("POST /api/auth/login (testkid/abcd)", bool(tok) and user.get("username") == USERNAME, f"xp={user.get('xp')}")
        return tok, user
    except Exception as e:
        record("POST /api/auth/login (testkid/abcd)", False, str(e))
        sys.exit(1)


def test_get_freedom_map_initial(tok):
    r = requests.get(f"{BACKEND_URL}/freedom-map", headers=auth_headers(tok), timeout=30)
    if r.status_code != 200:
        record("GET /api/freedom-map (status 200)", False, f"{r.status_code} {r.text[:200]}")
        return None
    record("GET /api/freedom-map (status 200)", True)
    data = r.json()
    heroes = data.get("heroes", [])

    record(
        "GET /api/freedom-map: total=35 and len(heroes)==35",
        data.get("total") == 35 and len(heroes) == 35,
        f"total={data.get('total')}, len={len(heroes)}",
    )

    required = ["hero_id", "name", "state", "x", "y", "short_line", "has_story", "story_id", "portrait_url", "discovered"]
    missing_field_heroes = []
    type_issues = []
    bounds_issues = []
    for h in heroes:
        for k in required:
            if k not in h:
                missing_field_heroes.append((h.get("hero_id"), k))
        if not isinstance(h.get("x"), (int, float)):
            type_issues.append(f"{h.get('hero_id')} x type={type(h.get('x')).__name__}")
        if not isinstance(h.get("y"), (int, float)):
            type_issues.append(f"{h.get('hero_id')} y type={type(h.get('y')).__name__}")
        if not isinstance(h.get("has_story"), bool):
            type_issues.append(f"{h.get('hero_id')} has_story type={type(h.get('has_story')).__name__}")
        if not isinstance(h.get("portrait_url"), str):
            type_issues.append(f"{h.get('hero_id')} portrait_url type={type(h.get('portrait_url')).__name__}")
        if not isinstance(h.get("discovered"), bool):
            type_issues.append(f"{h.get('hero_id')} discovered type={type(h.get('discovered')).__name__}")
        sid = h.get("story_id")
        if sid is not None and not isinstance(sid, str):
            type_issues.append(f"{h.get('hero_id')} story_id type={type(sid).__name__}")
        x, y = h.get("x"), h.get("y")
        if isinstance(x, (int, float)) and not (0 <= x <= 612):
            bounds_issues.append(f"{h.get('hero_id')} x={x}")
        if isinstance(y, (int, float)) and not (0 <= y <= 696):
            bounds_issues.append(f"{h.get('hero_id')} y={y}")

    record("Each hero has all required fields", not missing_field_heroes, str(missing_field_heroes)[:300])
    record("Each hero has correct field types", not type_issues, ";".join(type_issues)[:300])
    record("x in [0,612] and y in [0,696]", not bounds_issues, ";".join(bounds_issues)[:300])

    record(
        "Initial discovered_count == 0",
        data.get("discovered_count") == 0,
        f"discovered_count={data.get('discovered_count')}",
    )

    by_id = {h["hero_id"]: h for h in heroes}

    bs = by_id.get("bhagat-singh")
    ok = bs is not None and bs.get("has_story") is True and bs.get("story_id") == "bhagat-singh" and bs.get("state") == "Punjab"
    record("Spot check bhagat-singh (Punjab, has_story=True, story_id=bhagat-singh)", ok, str(bs)[:200] if bs else "missing")

    ts = by_id.get("tirot-sing")
    ok = ts is not None and ts.get("has_story") is False and ts.get("story_id") is None and ts.get("state") == "Meghalaya"
    record("Spot check tirot-sing (Meghalaya, has_story=False, story_id=None)", ok, str(ts)[:200] if ts else "missing")

    kb = by_id.get("kanaklata-barua")
    ok = kb is not None and kb.get("has_story") is False and kb.get("state") == "Assam"
    record("Spot check kanaklata-barua (Assam, has_story=False)", ok, str(kb)[:200] if kb else "missing")

    return data


def test_discover_bhagat_singh_first(tok, baseline_xp):
    r = requests.post(f"{BACKEND_URL}/freedom-map/discover/bhagat-singh", headers=auth_headers(tok), timeout=30)
    if r.status_code != 200:
        record("POST /api/freedom-map/discover/bhagat-singh (1st)", False, f"{r.status_code} {r.text[:200]}")
        return None
    data = r.json()
    ok = (
        data.get("just_discovered") is True
        and data.get("xp_awarded") == 5
        and data.get("discovered_count") == 1
        and data.get("badge_awarded") is None
    )
    record(
        "POST discover/bhagat-singh (1st): just_discovered=true, xp=5, count=1, badge=null",
        ok,
        f"data={ {k:data.get(k) for k in ['just_discovered','xp_awarded','discovered_count','badge_awarded']} }",
    )
    new_xp = data["user"]["xp"]
    record(
        "User XP increased by exactly 5",
        new_xp == baseline_xp + 5,
        f"baseline={baseline_xp}, new={new_xp}",
    )
    return data


def test_discover_bhagat_singh_idempotent(tok, xp_after_first):
    r = requests.post(f"{BACKEND_URL}/freedom-map/discover/bhagat-singh", headers=auth_headers(tok), timeout=30)
    if r.status_code != 200:
        record("POST /api/freedom-map/discover/bhagat-singh (2nd)", False, f"{r.status_code} {r.text[:200]}")
        return
    data = r.json()
    ok = (
        data.get("just_discovered") is False
        and data.get("xp_awarded") == 0
        and data["user"]["xp"] == xp_after_first
    )
    record(
        "POST discover/bhagat-singh (2nd, idempotent): just_discovered=false, xp=0, no double XP",
        ok,
        f"data={ {k:data.get(k) for k in ['just_discovered','xp_awarded']} }, user.xp={data['user']['xp']}",
    )


def test_discover_invalid(tok):
    r = requests.post(f"{BACKEND_URL}/freedom-map/discover/some-fake-hero", headers=auth_headers(tok), timeout=30)
    record(
        "POST /api/freedom-map/discover/some-fake-hero returns 404",
        r.status_code == 404,
        f"status={r.status_code}, body={r.text[:200]}",
    )


def test_freedom_map_after_discovery(tok):
    r = requests.get(f"{BACKEND_URL}/freedom-map", headers=auth_headers(tok), timeout=30)
    if r.status_code != 200:
        record("GET /api/freedom-map after a discovery", False, str(r.status_code))
        return
    data = r.json()
    by_id = {h["hero_id"]: h for h in data["heroes"]}
    bs = by_id.get("bhagat-singh")
    record(
        "After discovery, bhagat-singh.discovered=true",
        bs is not None and bs.get("discovered") is True,
        f"bhagat-singh.discovered={bs.get('discovered') if bs else None}",
    )
    record(
        "discovered_count=1 after one discovery",
        data.get("discovered_count") == 1,
        f"discovered_count={data.get('discovered_count')}",
    )


def test_all_35_discoveries():
    reset_testkid()
    tok, user = login()
    baseline_xp = user["xp"]

    r = requests.get(f"{BACKEND_URL}/freedom-map", headers=auth_headers(tok), timeout=30)
    heroes = r.json()["heroes"]
    hero_ids = [h["hero_id"] for h in heroes]
    record("Fresh map after reset: 35 heroes, 0 discovered",
           len(hero_ids) == 35 and r.json()["discovered_count"] == 0,
           f"len={len(hero_ids)}, discovered_count={r.json()['discovered_count']}")

    badge_awarded_on = None
    last_response = None
    pre_badge_badge_awarded_seen = False
    for i, hid in enumerate(hero_ids, start=1):
        resp = requests.post(f"{BACKEND_URL}/freedom-map/discover/{hid}", headers=auth_headers(tok), timeout=30)
        if resp.status_code != 200:
            record(f"Discover #{i} {hid}", False, f"{resp.status_code} {resp.text[:200]}")
            return
        d = resp.json()
        if d.get("badge_awarded") is not None:
            if i < 35:
                pre_badge_badge_awarded_seen = True
            badge_awarded_on = i
        if i == 35:
            last_response = d

    record("No badge awarded before 35th discovery",
           not pre_badge_badge_awarded_seen,
           f"premature badge at i={badge_awarded_on}")

    ok = (
        last_response is not None
        and last_response.get("badge_awarded") == "map_explorer"
        and last_response.get("discovered_count") == 35
    )
    record(
        "35th discovery returns badge_awarded='map_explorer' and discovered_count=35",
        ok,
        f"badge_awarded={last_response.get('badge_awarded') if last_response else None}, "
        f"discovered_count={last_response.get('discovered_count') if last_response else None}",
    )

    r = requests.get(f"{BACKEND_URL}/me", headers=auth_headers(tok), timeout=30)
    me_data = r.json()
    record(
        "user.badges contains 'map_explorer' after all 35",
        "map_explorer" in (me_data.get("badges") or []),
        f"badges={me_data.get('badges')}",
    )

    record(
        "Total XP gain == 35*5 = 175",
        me_data.get("xp") == baseline_xp + 175,
        f"baseline={baseline_xp}, final={me_data.get('xp')}, delta={me_data.get('xp')-baseline_xp}",
    )


def main():
    print("="*70)
    print("Freedom Map of India — Backend Tests")
    print("="*70)

    reset_testkid()

    tok, user = test_login()
    baseline_xp = user["xp"]

    test_get_freedom_map_initial(tok)

    first = test_discover_bhagat_singh_first(tok, baseline_xp)
    if first is None:
        return
    xp_after_first = first["user"]["xp"]

    test_discover_bhagat_singh_idempotent(tok, xp_after_first)

    test_discover_invalid(tok)

    test_freedom_map_after_discovery(tok)

    test_all_35_discoveries()

    print("\n" + "="*70)
    print("SUMMARY")
    print("="*70)
    passed = sum(1 for _, p, _ in results if p)
    total = len(results)
    for name, p, detail in results:
        print(f"{'PASS' if p else 'FAIL'} | {name}" + (f" | {detail}" if (not p and detail) else ""))
    print(f"\n{passed}/{total} assertions passed")
    if passed != total:
        sys.exit(1)


if __name__ == "__main__":
    main()
