"""Backend test script for Azaadi Tales Phase 3:
- 30-story catalog
- Treasure Hunts API
- Regression: auth/me/chat/journal
"""
import os
import sys
import json
import random
import string
import requests

BASE = "https://azaadi-stories.preview.emergentagent.com/api"

NEW_STORY_IDS = [
    "sardar-patel", "lala-lajpat-rai", "tilak", "sukhdev", "rajguru",
    "khudiram-bose", "surya-sen", "bagha-jatin", "matangini-hazra",
    "bipin-pal", "veer-savarkar", "madam-cama", "tantia-tope",
    "subramania-bharati", "alluri-sitarama-raju", "velu-thampi",
    "begum-hazrat-mahal", "kittur-chennamma", "aruna-asaf-ali",
    "kalpana-datta", "birsa-munda", "tilka-manjhi",
]

results = []

def report(name, ok, detail=""):
    status = "PASS" if ok else "FAIL"
    line = f"[{status}] {name}" + (f" — {detail}" if detail else "")
    print(line)
    results.append({"name": name, "ok": ok, "detail": detail})

def must(cond, name, detail=""):
    report(name, bool(cond), detail)
    return bool(cond)

def rand_username(prefix="huntkid"):
    s = "".join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"{prefix}_{s}"


# ========== 1) Stories ==========
def test_stories_catalog():
    print("\n=== Stories Catalog ===")
    r = requests.get(f"{BASE}/stories", timeout=30)
    must(r.status_code == 200, "GET /api/stories status 200", f"got {r.status_code}")
    data = r.json()
    must(isinstance(data, list), "GET /api/stories returns list")
    must(len(data) == 30, f"GET /api/stories returns EXACTLY 30 stories", f"got {len(data)}")
    ids_present = {s["id"] for s in data}
    missing = [sid for sid in NEW_STORY_IDS if sid not in ids_present]
    must(not missing, "All 22 new story IDs present", f"missing: {missing}")

    # detail + quiz checks
    for sid in NEW_STORY_IDS:
        r = requests.get(f"{BASE}/stories/{sid}", timeout=30)
        ok = r.status_code == 200
        if not ok:
            report(f"GET /stories/{sid}", False, f"status {r.status_code}")
            continue
        d = r.json()
        fields_ok = all(d.get(k) for k in ("story_en", "story_hi"))
        lessons_ok = bool(d.get("lessons_en")) and bool(d.get("lessons_hi"))
        report(
            f"Story {sid} has non-empty story_en/hi/lessons_en/hi",
            fields_ok and lessons_ok,
            f"keys-ok story={fields_ok} lessons={lessons_ok}",
        )

    for sid in ("birsa-munda", "madam-cama", "kittur-chennamma"):
        r = requests.get(f"{BASE}/stories/{sid}/quiz", timeout=30)
        ok = r.status_code == 200 and isinstance(r.json(), list) and len(r.json()) == 5
        report(f"GET /stories/{sid}/quiz returns 5 questions", ok,
               f"status {r.status_code} len {len(r.json()) if r.status_code==200 else '?'}")


# ========== 2) Treasure Hunts ==========
def signup_kid(username, password="abcd"):
    r = requests.post(f"{BASE}/auth/signup", json={
        "username": username, "password": password,
        "age": 9, "avatar": "owl", "language": "en", "role": "kid",
    }, timeout=30)
    if r.status_code != 200:
        return None, None
    body = r.json()
    return body["token"], body["user"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_hunts():
    print("\n=== Treasure Hunts ===")

    # Auth required
    r = requests.get(f"{BASE}/hunts", timeout=15)
    must(r.status_code == 401, "GET /api/hunts without token → 401", f"got {r.status_code}")
    r = requests.get(f"{BASE}/hunts/hunt-1857", timeout=15)
    must(r.status_code == 401, "GET /api/hunts/hunt-1857 without token → 401", f"got {r.status_code}")
    r = requests.post(f"{BASE}/hunts/hunt-1857/answer", json={"clue_id": "c1", "answer_id": "x"}, timeout=15)
    must(r.status_code == 401, "POST hunt answer without token → 401", f"got {r.status_code}")

    # Fresh kid
    uname = rand_username()
    token, user = signup_kid(uname)
    must(token is not None, f"Signup fresh kid {uname}", "ok" if token else "failed")
    if not token:
        return
    h = auth(token)
    baseline_xp = user.get("xp", 0)

    # GET /api/hunts
    r = requests.get(f"{BASE}/hunts", headers=h, timeout=15)
    must(r.status_code == 200, "GET /api/hunts auth ok", f"status {r.status_code}")
    hunts = r.json()
    must(isinstance(hunts, list) and len(hunts) == 3, "GET /api/hunts returns 3 hunts",
         f"got {len(hunts) if isinstance(hunts, list) else '?'}")
    expected_ids = {"hunt-1857", "hunt-women", "hunt-youth"}
    got_ids = {h_.get("id") for h_ in hunts}
    must(got_ids == expected_ids, "Hunt IDs match", f"got {got_ids}")
    for hh in hunts:
        for k in ("id","title_en","title_hi","tagline_en","tagline_hi","icon","color",
                 "badge_id","xp_reward","total_clues","solved_clues","completed","percent"):
            if k not in hh:
                report(f"Hunt {hh.get('id')} has key {k}", False)
                break
        else:
            ok = (hh["xp_reward"] == 75 and hh["total_clues"] == 5
                  and hh["solved_clues"] == 0 and hh["completed"] is False
                  and hh["percent"] == 0)
            report(f"Hunt {hh['id']} fresh-progress correct", ok,
                   f"xp_reward={hh['xp_reward']} total={hh['total_clues']} solved={hh['solved_clues']} pct={hh['percent']}")

    # GET /api/hunts/hunt-1857
    r = requests.get(f"{BASE}/hunts/hunt-1857", headers=h, timeout=15)
    must(r.status_code == 200, "GET /api/hunts/hunt-1857 auth ok", f"status {r.status_code}")
    hd = r.json()
    must(isinstance(hd.get("clues"), list) and len(hd["clues"]) == 5,
         "hunt-1857 returns 5 clues",
         f"len={len(hd.get('clues', []))}")
    answer_leak = any("answer_id" in c for c in hd.get("clues", []))
    must(not answer_leak, "Clues do NOT contain answer_id", "leaked!" if answer_leak else "")
    for c in hd.get("clues", []):
        for k in ("id","clue_en","clue_hi","options","hint_en","hint_hi"):
            if k not in c:
                report(f"Clue {c.get('id')} missing field {k}", False)
                break
        else:
            opts = c["options"]
            ok = (isinstance(opts, list) and len(opts) == 4 and
                  all(isinstance(o, dict) and {"id","name","color"}.issubset(o.keys()) for o in opts))
            report(f"hunt-1857 clue {c['id']} has 4 valid hero options", ok)
    must(hd.get("solved_clues") == [] and hd.get("completed") is False,
         "hunt-1857 fresh user solved=[] completed=false")

    # Invalid hunt id
    r = requests.get(f"{BASE}/hunts/foo", headers=h, timeout=15)
    must(r.status_code == 404, "GET /api/hunts/foo → 404", f"status {r.status_code}")

    # POST correct c1
    r = requests.post(f"{BASE}/hunts/hunt-1857/answer", headers=h,
                      json={"clue_id": "c1", "answer_id": "mangal-pandey"}, timeout=15)
    must(r.status_code == 200, "POST answer c1 correct status 200", f"status {r.status_code}")
    body = r.json()
    must(body.get("correct") is True, "c1 correct=true")
    must(body.get("xp_awarded") == 5, "c1 xp_awarded=5", f"got {body.get('xp_awarded')}")
    must(body.get("solved_clues") == ["c1"], "solved_clues=['c1']", f"got {body.get('solved_clues')}")
    must(body.get("just_completed") is False, "just_completed=false")
    must(body.get("badge_awarded") is None, "badge_awarded=null on first clue")
    user_after = body.get("user", {})
    must(user_after.get("xp") == baseline_xp + 5, "User XP increased by 5",
         f"baseline={baseline_xp} got={user_after.get('xp')}")

    # POST wrong c1
    r = requests.post(f"{BASE}/hunts/hunt-1857/answer", headers=h,
                      json={"clue_id": "c1", "answer_id": "bhagat-singh"}, timeout=15)
    must(r.status_code == 200, "POST wrong answer status 200")
    b2 = r.json()
    must(b2.get("correct") is False, "wrong answer correct=false")
    must(b2.get("xp_awarded") == 0, "wrong answer xp_awarded=0", f"got {b2.get('xp_awarded')}")
    must(b2.get("solved_clues") == ["c1"], "solved still ['c1']", f"got {b2.get('solved_clues')}")
    must(b2.get("user", {}).get("xp") == baseline_xp + 5, "User XP unchanged after wrong answer",
         f"got {b2.get('user', {}).get('xp')}")

    # Repeat correct c1 — no double count, no extra xp
    r = requests.post(f"{BASE}/hunts/hunt-1857/answer", headers=h,
                      json={"clue_id": "c1", "answer_id": "mangal-pandey"}, timeout=15)
    b3 = r.json()
    must(b3.get("solved_clues") == ["c1"], "Repeat correct: solved_clues remains ['c1']",
         f"got {b3.get('solved_clues')}")
    must(b3.get("user", {}).get("xp") == baseline_xp + 5, "Repeat correct: no extra XP",
         f"got {b3.get('user', {}).get('xp')}")

    # Solve c2..c5
    answers = [
        ("c2", "rani-lakshmibai"),
        ("c3", "tantia-tope"),
        ("c4", "begum-hazrat-mahal"),
        ("c5", "kittur-chennamma"),
    ]
    final_body = None
    for cid, ans in answers:
        r = requests.post(f"{BASE}/hunts/hunt-1857/answer", headers=h,
                          json={"clue_id": cid, "answer_id": ans}, timeout=15)
        must(r.status_code == 200, f"POST answer {cid} ok", f"status {r.status_code}")
        final_body = r.json()
        must(final_body.get("correct") is True, f"{cid} correct=true")

    # Final c5 expectations
    must(final_body.get("just_completed") is True, "5th correct: just_completed=true")
    must(final_body.get("completed") is True, "5th correct: completed=true")
    must(final_body.get("xp_awarded") == 80, "5th correct: xp_awarded=80 (5+75)",
         f"got {final_body.get('xp_awarded')}")
    must(final_body.get("badge_awarded") == "hunt_1857", "Badge hunt_1857 awarded",
         f"got {final_body.get('badge_awarded')}")
    final_user = final_body.get("user", {})
    must("hunt_1857" in final_user.get("badges", []), "User now has hunt_1857 badge",
         f"badges {final_user.get('badges')}")
    expected_xp = baseline_xp + 5 * 5 + 75  # 5 clues + bonus
    must(final_user.get("xp") == expected_xp, f"User XP = baseline+{5*5+75}",
         f"baseline={baseline_xp} expected={expected_xp} got={final_user.get('xp')}")

    # Wrong hunt id on answer endpoint → 404
    r = requests.post(f"{BASE}/hunts/foo/answer", headers=h,
                      json={"clue_id": "c1", "answer_id": "x"}, timeout=15)
    must(r.status_code == 404, "POST answer on invalid hunt → 404", f"status {r.status_code}")

    # Clue not in hunt → 404
    r = requests.post(f"{BASE}/hunts/hunt-1857/answer", headers=h,
                      json={"clue_id": "c99", "answer_id": "x"}, timeout=15)
    must(r.status_code == 404, "POST answer on invalid clue id → 404", f"status {r.status_code}")

    # Each hunt: 5 clues, 4 options
    for hid in ("hunt-1857", "hunt-women", "hunt-youth"):
        r = requests.get(f"{BASE}/hunts/{hid}", headers=h, timeout=15)
        ok = r.status_code == 200
        if ok:
            d = r.json()
            ok = len(d.get("clues", [])) == 5 and all(len(c.get("options", [])) == 4 for c in d["clues"])
        report(f"Hunt {hid} → 5 clues with 4 options each", ok)

    # First clue of hunt-women
    uname2 = rand_username("women")
    t2, u2 = signup_kid(uname2)
    h2 = auth(t2)
    r = requests.post(f"{BASE}/hunts/hunt-women/answer", headers=h2,
                      json={"clue_id": "c1", "answer_id": "sarojini-naidu"}, timeout=15)
    must(r.status_code == 200 and r.json().get("correct") is True,
         "hunt-women c1 = sarojini-naidu correct",
         f"status {r.status_code} body {r.json() if r.status_code == 200 else r.text[:120]}")

    # First clue of hunt-youth
    uname3 = rand_username("youth")
    t3, u3 = signup_kid(uname3)
    h3 = auth(t3)
    r = requests.post(f"{BASE}/hunts/hunt-youth/answer", headers=h3,
                      json={"clue_id": "c1", "answer_id": "bhagat-singh"}, timeout=15)
    must(r.status_code == 200 and r.json().get("correct") is True,
         "hunt-youth c1 = bhagat-singh correct",
         f"status {r.status_code}")


# ========== 3) Regression ==========
def test_regression():
    print("\n=== Regression ===")
    uname = rand_username("regress")
    token, user = signup_kid(uname)
    must(token is not None, f"Regression: signup {uname}", "ok" if token else "failed")
    if not token:
        return
    h = auth(token)

    # login
    r = requests.post(f"{BASE}/auth/login", json={"username": uname, "password": "abcd"}, timeout=15)
    must(r.status_code == 200, "Login works for newly created user", f"status {r.status_code}")

    # /me
    r = requests.get(f"{BASE}/me", headers=h, timeout=15)
    must(r.status_code == 200, "GET /api/me works", f"status {r.status_code}")

    # /chat
    r = requests.post(f"{BASE}/chat", headers=h,
                      json={"message": "Tell me one fun fact about Bhagat Singh in one sentence.",
                            "language": "en"}, timeout=60)
    if r.status_code == 200:
        rep = r.json().get("reply", "")
        must(isinstance(rep, str) and len(rep.strip()) > 5, "Chat returns Azaadi reply", f"len={len(rep)}")
    else:
        must(False, "POST /api/chat returns 200", f"status {r.status_code} body {r.text[:200]}")

    # /journal
    r = requests.post(f"{BASE}/journal", headers=h,
                      json={"text": "I learned today that Bhagat Singh was very brave and read many books."},
                      timeout=60)
    if r.status_code == 200:
        body = r.json()
        # may be approved/pending/rejected; just verify endpoint works
        ok = body.get("ok") in (True, False) and "status" in body
        must(ok, "POST /api/journal works", f"body {body}")
    else:
        must(False, "POST /api/journal returns 200", f"status {r.status_code} body {r.text[:200]}")


def main():
    test_stories_catalog()
    test_hunts()
    test_regression()

    failed = [r for r in results if not r["ok"]]
    print(f"\n=== TOTAL: {len(results)}  PASS: {len(results) - len(failed)}  FAIL: {len(failed)} ===")
    if failed:
        print("FAILURES:")
        for f in failed:
            print(f"  - {f['name']}: {f['detail']}")
    sys.exit(0 if not failed else 1)


if __name__ == "__main__":
    main()
