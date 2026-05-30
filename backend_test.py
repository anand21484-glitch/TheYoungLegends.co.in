"""Backend test for Jigsaw Puzzle endpoints — Azaadi Tales.

Tests the new /api/jigsaw endpoints per the review request.
Uses external preview URL for HTTP testing and MongoDB directly
(MONGO_URL from backend/.env) to RESET testkid's jigsaw progress
before running, so the first-time / idempotent assertions are valid
across repeated test runs.
"""
import sys
import asyncio
import requests
from motor.motor_asyncio import AsyncIOMotorClient

BASE_URL = "https://azaadi-stories.preview.emergentagent.com/api"
KID_USERNAME = "testkid"
KID_PASSWORD = "abcd"

MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "azaadi_tales"

EXPECTED_HEROES = [
    "sarojini-naidu",
    "bhimrao-ambedkar",
    "mahatma-gandhi",
    "tilak",
    "sardar-patel",
]

results = []  # list[(name, pass_bool, message)]


def record(name, ok, msg=""):
    results.append((name, ok, msg))
    status = "PASS" if ok else "FAIL"
    print(f"[{status}] {name}: {msg}")


async def reset_kid_jigsaw():
    """Reset testkid's jigsaw_solved field and remove jigsaw_master badge so
    we can test first-time / idempotent / badge flows cleanly."""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    user = await db.users.find_one({"username": KID_USERNAME})
    if not user:
        print("!! testkid not found in DB.")
        client.close()
        return None
    xp_before = user.get("xp", 0)
    badges = [b for b in (user.get("badges") or []) if b != "jigsaw_master"]
    await db.users.update_one(
        {"username": KID_USERNAME},
        {"$set": {"jigsaw_solved": [], "badges": badges}},
    )
    print(f"Reset testkid: jigsaw_solved=[], removed jigsaw_master badge. xp_pre_reset={xp_before}")
    client.close()
    return xp_before


def login(username, password):
    return requests.post(f"{BASE_URL}/auth/login", json={"username": username, "password": password}, timeout=30)


def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


def test_login():
    print("\n=== 1. POST /api/auth/login ===")
    r = login(KID_USERNAME, KID_PASSWORD)
    if r.status_code != 200:
        record("login_testkid", False, f"HTTP {r.status_code}: {r.text}")
        return None, None
    data = r.json()
    token = data.get("token")
    user = data.get("user")
    if not token or not user:
        record("login_testkid", False, f"missing token/user in response: {data}")
        return None, None
    record("login_testkid", True, f"got token, user.xp={user.get('xp')}")
    return token, user


def test_list_jigsaw(token, expected_solved_set=None, label="list_jigsaw"):
    print(f"\n=== GET /api/jigsaw ({label}) ===")
    r = requests.get(f"{BASE_URL}/jigsaw", headers=auth_headers(token), timeout=30)
    if r.status_code != 200:
        record(f"{label}_status", False, f"HTTP {r.status_code}: {r.text}")
        return None
    record(f"{label}_status", True, "HTTP 200")
    data = r.json()
    if not isinstance(data, list) or len(data) != 5:
        record(f"{label}_count", False, f"expected list of 5, got {type(data).__name__} len={len(data) if isinstance(data, list) else 'n/a'}")
        return data
    record(f"{label}_count", True, "5 puzzles returned")

    ids = [p.get("id") for p in data]
    missing = [h for h in EXPECTED_HEROES if h not in ids]
    if missing:
        record(f"{label}_ids", False, f"missing expected hero ids: {missing}. got={ids}")
    else:
        record(f"{label}_ids", True, "contains all 5 expected hero ids")

    required_fields = ["id", "name", "title_en", "title_hi", "color", "era", "portrait_url", "grid", "xp_reward", "solved"]
    fields_ok = True
    for p in data:
        for f in required_fields:
            if f not in p:
                record(f"{label}_fields", False, f"puzzle {p.get('id')} missing field '{f}'")
                fields_ok = False
                break
        if p.get("grid") != 3:
            record(f"{label}_grid_val", False, f"puzzle {p.get('id')} grid={p.get('grid')} (expected 3)")
            fields_ok = False
        if p.get("xp_reward") != 30:
            record(f"{label}_xp_val", False, f"puzzle {p.get('id')} xp_reward={p.get('xp_reward')} (expected 30)")
            fields_ok = False
        if not isinstance(p.get("solved"), bool):
            record(f"{label}_solved_type", False, f"puzzle {p.get('id')} solved type={type(p.get('solved')).__name__} (expected bool)")
            fields_ok = False
        if not isinstance(p.get("portrait_url"), str) or "/api/stories/" not in p.get("portrait_url", ""):
            record(f"{label}_portrait_url", False, f"puzzle {p.get('id')} bad portrait_url={p.get('portrait_url')}")
            fields_ok = False
    if fields_ok:
        record(f"{label}_fields", True, "all puzzles contain required fields with correct types/values")

    if expected_solved_set is not None:
        all_ok = True
        for p in data:
            want = p["id"] in expected_solved_set
            if p["solved"] != want:
                record(f"{label}_solved_state[{p['id']}]", False, f"solved={p['solved']} expected={want}")
                all_ok = False
        if all_ok:
            record(f"{label}_solved_states", True, f"solved flags match expected set={sorted(expected_solved_set)}")
    return data


def test_complete_first(token, baseline_xp):
    print("\n=== 3. POST /api/jigsaw/sarojini-naidu/complete (first call) ===")
    r = requests.post(f"{BASE_URL}/jigsaw/sarojini-naidu/complete", headers=auth_headers(token), timeout=30)
    if r.status_code != 200:
        record("complete_first_status", False, f"HTTP {r.status_code}: {r.text}")
        return None
    record("complete_first_status", True, "HTTP 200")
    d = r.json()
    checks = [
        ("complete_first_just_solved", d.get("just_solved") is True, f"just_solved={d.get('just_solved')}"),
        ("complete_first_xp_awarded", d.get("xp_awarded") == 30, f"xp_awarded={d.get('xp_awarded')}"),
        ("complete_first_solved_count", d.get("solved_count") == 1, f"solved_count={d.get('solved_count')}"),
        ("complete_first_total", d.get("total") == 5, f"total={d.get('total')}"),
    ]
    for name, ok, msg in checks:
        record(name, ok, msg)
    user = d.get("user") or {}
    if not user:
        record("complete_first_user", False, "missing user in response")
    else:
        record("complete_first_user", True, f"user returned (xp={user.get('xp')})")
        if user.get("xp") != baseline_xp + 30:
            record("complete_first_xp_increased", False, f"user.xp={user.get('xp')} expected={baseline_xp + 30}")
        else:
            record("complete_first_xp_increased", True, f"user.xp went {baseline_xp} -> {user.get('xp')} (+30)")
    return d


def test_complete_idempotent(token, expected_xp_after_first):
    print("\n=== 4. POST /api/jigsaw/sarojini-naidu/complete (second call — idempotent) ===")
    r = requests.post(f"{BASE_URL}/jigsaw/sarojini-naidu/complete", headers=auth_headers(token), timeout=30)
    if r.status_code != 200:
        record("complete_idempotent_status", False, f"HTTP {r.status_code}: {r.text}")
        return
    record("complete_idempotent_status", True, "HTTP 200")
    d = r.json()
    record("complete_idempotent_just_solved", d.get("just_solved") is False, f"just_solved={d.get('just_solved')}")
    record("complete_idempotent_xp_awarded", d.get("xp_awarded") == 0, f"xp_awarded={d.get('xp_awarded')}")
    user = d.get("user") or {}
    record("complete_idempotent_no_double_xp", user.get("xp") == expected_xp_after_first,
           f"user.xp={user.get('xp')} expected={expected_xp_after_first}")
    record("complete_idempotent_solved_count", d.get("solved_count") == 1, f"solved_count={d.get('solved_count')}")


def test_complete_invalid(token):
    print("\n=== 5. POST /api/jigsaw/invalid-hero/complete ===")
    r = requests.post(f"{BASE_URL}/jigsaw/invalid-hero/complete", headers=auth_headers(token), timeout=30)
    if r.status_code != 404:
        record("complete_invalid_status", False, f"HTTP {r.status_code} (expected 404). body={r.text}")
        return
    record("complete_invalid_status", True, "HTTP 404")
    try:
        d = r.json()
        detail = d.get("detail", "")
        record("complete_invalid_detail", "Not a jigsaw puzzle" in detail,
               f"detail='{detail}'")
    except Exception as e:
        record("complete_invalid_detail", False, f"could not parse json: {e}")


def test_complete_all_and_badge(token):
    print("\n=== 7. Complete remaining 4 puzzles + verify jigsaw_master badge ===")
    remaining = [h for h in EXPECTED_HEROES if h != "sarojini-naidu"]
    last_resp = None
    for i, hid in enumerate(remaining):
        r = requests.post(f"{BASE_URL}/jigsaw/{hid}/complete", headers=auth_headers(token), timeout=30)
        if r.status_code != 200:
            record(f"complete_{hid}_status", False, f"HTTP {r.status_code}: {r.text}")
            return None
        d = r.json()
        record(f"complete_{hid}_status", True,
               f"solved_count={d.get('solved_count')}, just_solved={d.get('just_solved')}, badge_awarded={d.get('badge_awarded')}")
        is_last = (i == len(remaining) - 1)
        last_resp = d
        if is_last:
            record("badge_solved_count_5", d.get("solved_count") == 5,
                   f"solved_count={d.get('solved_count')}")
            record("badge_awarded_field", d.get("badge_awarded") == "jigsaw_master",
                   f"badge_awarded={d.get('badge_awarded')}")
            user = d.get("user") or {}
            record("badge_in_user_badges", "jigsaw_master" in (user.get("badges") or []),
                   f"user.badges={user.get('badges')}")
    return last_resp


def test_portrait_urls(token, puzzles):
    print("\n=== 8. Portrait URL GET checks for each puzzle ===")
    for p in puzzles:
        url = f"{BASE_URL}/stories/{p['id']}/portrait"
        try:
            r = requests.get(url, headers=auth_headers(token), timeout=60)
        except Exception as e:
            record(f"portrait_{p['id']}", False, f"request error: {e}")
            continue
        ctype = r.headers.get("content-type", "")
        size = len(r.content) if r.content else 0
        if r.status_code != 200:
            record(f"portrait_{p['id']}", False, f"HTTP {r.status_code} on {url}. body[:200]={r.text[:200]}")
            continue
        if not ctype.startswith("image/"):
            record(f"portrait_{p['id']}", False, f"content-type={ctype} (expected image/*)")
            continue
        if size < 1000:
            record(f"portrait_{p['id']}", False, f"image too small: {size} bytes")
            continue
        record(f"portrait_{p['id']}", True, f"200 {ctype} {size // 1024} KB")


async def main():
    await reset_kid_jigsaw()

    token, user = test_login()
    if not token:
        print("\nABORT: could not authenticate.")
        return finalize()
    baseline_xp = user.get("xp", 0)
    print(f"baseline xp (after reset, post-login) = {baseline_xp}")

    puzzles = test_list_jigsaw(token, expected_solved_set=set(), label="list_jigsaw_initial")

    test_complete_first(token, baseline_xp)

    expected_xp_after_first = baseline_xp + 30
    test_complete_idempotent(token, expected_xp_after_first)

    test_complete_invalid(token)

    print("\n=== 6. GET /api/jigsaw (after one completion) — verify sarojini-naidu solved=true ===")
    test_list_jigsaw(token, expected_solved_set={"sarojini-naidu"}, label="list_jigsaw_after_one")

    test_complete_all_and_badge(token)

    if puzzles:
        test_portrait_urls(token, puzzles)

    finalize()


def finalize():
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    passed = sum(1 for _, ok, _ in results if ok)
    failed = sum(1 for _, ok, _ in results if not ok)
    print(f"Total: {len(results)}  Passed: {passed}  Failed: {failed}")
    if failed:
        print("\nFAILED CHECKS:")
        for name, ok, msg in results:
            if not ok:
                print(f"  - {name}: {msg}")
    sys.exit(0 if failed == 0 else 1)


if __name__ == "__main__":
    asyncio.run(main())
