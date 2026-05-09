"""Azaadi Tales backend API tests."""
import os, time, requests, pytest

BASE = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://730246d0-d833-413a-aa90-b36bdaf599fb.preview.emergentagent.com").rstrip("/")
API = f"{BASE}/api"

@pytest.fixture(scope="module")
def s():
    return requests.Session()

@pytest.fixture(scope="module")
def token(s):
    # login existing testkid
    r = s.post(f"{API}/auth/login", json={"username": "testkid", "password": "abcd"}, timeout=20)
    if r.status_code != 200:
        # signup if missing
        r = s.post(f"{API}/auth/signup", json={"username": "testkid", "password": "abcd", "age": 10, "avatar": "🦁", "language": "en"}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()["token"]

@pytest.fixture(scope="module")
def auth_h(token):
    return {"Authorization": f"Bearer {token}"}

def test_root(s):
    r = s.get(f"{API}/", timeout=15)
    assert r.status_code == 200 and r.json().get("status") == "ok"

def test_signup_new_user(s):
    u = f"TEST_{int(time.time())}"
    r = s.post(f"{API}/auth/signup", json={"username": u, "password": "abcd", "age": 8, "avatar": "🦉", "language": "hi"}, timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert "token" in d and d["user"]["username"] == u.lower()
    assert d["user"]["language"] == "hi"

def test_login_invalid(s):
    r = s.post(f"{API}/auth/login", json={"username": "nope_x", "password": "wrong"}, timeout=15)
    assert r.status_code == 401

def test_me_requires_auth(s):
    r = s.get(f"{API}/me", timeout=15)
    assert r.status_code == 401

def test_me(s, auth_h):
    r = s.get(f"{API}/me", headers=auth_h, timeout=15)
    assert r.status_code == 200
    d = r.json()
    for k in ("id", "username", "xp", "level", "level_name", "badges", "completed_stories"):
        assert k in d

def test_stories_list(s):
    r = s.get(f"{API}/stories", timeout=15)
    assert r.status_code == 200
    arr = r.json()
    assert isinstance(arr, list) and len(arr) >= 8
    assert all("title_en" in x and "title_hi" in x for x in arr)

def test_story_detail_and_quiz(s):
    arr = s.get(f"{API}/stories").json()
    sid = arr[0]["id"]
    r = s.get(f"{API}/stories/{sid}", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert d["story_en"] and d["story_hi"]
    rq = s.get(f"{API}/stories/{sid}/quiz", timeout=15)
    assert rq.status_code == 200
    qs = rq.json()
    assert len(qs) == 5
    # answers must NOT be exposed
    assert all("answer" not in q for q in qs)

def test_complete_story_awards_xp_and_badge(s, auth_h):
    arr = s.get(f"{API}/stories").json()
    sid = arr[0]["id"]
    before = s.get(f"{API}/me", headers=auth_h).json()
    r = s.post(f"{API}/stories/complete", json={"story_id": sid}, headers=auth_h, timeout=15)
    assert r.status_code == 200, r.text
    after = r.json()["user"]
    if sid not in before["completed_stories"]:
        assert after["xp"] >= before["xp"] + 20
    assert sid in after["completed_stories"]
    assert "first_story" in after["badges"]

def test_quiz_submit_perfect(s, auth_h):
    arr = s.get(f"{API}/stories").json()
    sid = arr[1]["id"]
    # peek answers via test-only path: not exposed; submit zeros and verify shape
    r = s.post(f"{API}/quiz/submit", json={"story_id": sid, "answers": [0, 0, 0, 0, 0]}, headers=auth_h, timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    for k in ("correct", "total", "percent", "xp_awarded", "correct_answers", "user"):
        assert k in d
    assert d["total"] == 5 and len(d["correct_answers"]) == 5

def test_quiz_perfect_score_path(s, auth_h):
    arr = s.get(f"{API}/stories").json()
    sid = arr[2]["id"]
    # First call to get correct_answers
    r1 = s.post(f"{API}/quiz/submit", json={"story_id": sid, "answers": [0]*5}, headers=auth_h, timeout=20).json()
    perfect = r1["correct_answers"]
    r2 = s.post(f"{API}/quiz/submit", json={"story_id": sid, "answers": perfect}, headers=auth_h, timeout=20)
    d = r2.json()
    assert d["correct"] == 5 and d["percent"] == 100
    assert "perfect_quiz" in d["user"]["badges"]

def test_quiz_bad_count(s, auth_h):
    arr = s.get(f"{API}/stories").json()
    r = s.post(f"{API}/quiz/submit", json={"story_id": arr[0]["id"], "answers": [0]}, headers=auth_h, timeout=15)
    assert r.status_code == 400

def test_badges_levels(s):
    rb = s.get(f"{API}/badges").json()
    rl = s.get(f"{API}/levels").json()
    assert isinstance(rb, list) and len(rb) >= 5
    assert isinstance(rl, list) and len(rl) >= 3

def test_chat_with_azaadi(s, auth_h):
    r = s.post(f"{API}/chat", json={"message": "Who was Bhagat Singh?", "language": "en"}, headers=auth_h, timeout=60)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d.get("reply") and len(d["reply"]) > 5
    # chat badge
    me = s.get(f"{API}/me", headers=auth_h).json()
    assert "chat_azaadi" in me["badges"]

def test_chat_history(s, auth_h):
    r = s.get(f"{API}/chat/history", headers=auth_h, timeout=15)
    assert r.status_code == 200
    arr = r.json()
    assert isinstance(arr, list) and len(arr) >= 1
    assert "user_text" in arr[0] and "azaadi_text" in arr[0]

def test_invalid_token(s):
    r = s.get(f"{API}/me", headers={"Authorization": "Bearer invalid.token.here"}, timeout=15)
    assert r.status_code == 401
