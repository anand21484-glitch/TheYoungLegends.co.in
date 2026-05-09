"""Phase 2 tests: Parent dashboard + Community Freedom Journal + AI moderation."""
import os, time, requests, pytest

BASE = os.environ["EXPO_PUBLIC_BACKEND_URL"].rstrip("/")
API = f"{BASE}/api"

TS = int(time.time())


def _signup(s, username, password="abcd", role="kid", age=10):
    payload = {"username": username, "password": password, "role": role}
    if role == "kid":
        payload.update({"age": age, "avatar": "🦉", "language": "en"})
    r = s.post(f"{API}/auth/signup", json=payload, timeout=20)
    if r.status_code == 400 and "taken" in r.text.lower():
        r = s.post(f"{API}/auth/login", json={"username": username, "password": password}, timeout=20)
    assert r.status_code == 200, r.text
    return r.json()


def _h(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def s():
    return requests.Session()


# Module-scoped accounts: parent + linked kid + standalone kid
@pytest.fixture(scope="module")
def accounts(s):
    parent = _signup(s, f"test_parent_{TS}", role="parent")
    linked_kid = _signup(s, f"test_kid_l_{TS}", role="kid")
    solo_kid = _signup(s, f"test_kid_s_{TS}", role="kid")
    # link the linked_kid to parent
    r = s.post(
        f"{API}/parent/link-child",
        json={"child_username": linked_kid["user"]["username"]},
        headers=_h(parent["token"]),
        timeout=20,
    )
    assert r.status_code == 200, r.text
    return {"parent": parent, "linked_kid": linked_kid, "solo_kid": solo_kid}


# ---------- Parent signup / role ----------
def test_parent_signup_role(s):
    u = f"test_parent_role_{TS}"
    r = s.post(f"{API}/auth/signup", json={"username": u, "password": "abcd", "role": "parent"}, timeout=20)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["user"]["role"] == "parent"
    assert d["user"]["username"] == u.lower()


def test_kid_default_role(s):
    u = f"test_kid_default_{TS}"
    r = s.post(f"{API}/auth/signup", json={"username": u, "password": "abcd", "age": 9}, timeout=20)
    assert r.status_code == 200
    assert r.json()["user"]["role"] == "kid"


# ---------- Link Child ----------
def test_link_child_sets_parent_id(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    kid_id = accounts["linked_kid"]["user"]["id"]
    # GET /parent/children should include the linked kid
    r = s.get(f"{API}/parent/children", headers=parent_h, timeout=15)
    assert r.status_code == 200
    kids = r.json()
    assert any(k["id"] == kid_id for k in kids), f"linked kid not in children list: {kids}"
    kid = next(k for k in kids if k["id"] == kid_id)
    for key in ("xp", "completed_stories", "badges", "quizzes_taken", "daily_goal"):
        assert key in kid


def test_link_child_invalid_username(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    r = s.post(f"{API}/parent/link-child", json={"child_username": f"nope_{TS}_xyz"}, headers=parent_h, timeout=15)
    assert r.status_code == 404


def test_link_child_blocks_parent_account(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    # Try to link another parent account as a child -> 400
    other_parent_user = f"test_parent_other_{TS}"
    s.post(f"{API}/auth/signup", json={"username": other_parent_user, "password": "abcd", "role": "parent"}, timeout=20)
    r = s.post(f"{API}/parent/link-child", json={"child_username": other_parent_user}, headers=parent_h, timeout=15)
    assert r.status_code == 400


# ---------- Set goal ----------
def test_set_goal_clamps(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    kid_id = accounts["linked_kid"]["user"]["id"]
    r = s.post(f"{API}/parent/child/{kid_id}/goal", json={"daily_goal": 99}, headers=parent_h, timeout=15)
    assert r.status_code == 200
    assert r.json()["daily_goal"] == 10
    r2 = s.post(f"{API}/parent/child/{kid_id}/goal", json={"daily_goal": 0}, headers=parent_h, timeout=15)
    assert r2.json()["daily_goal"] == 1
    r3 = s.post(f"{API}/parent/child/{kid_id}/goal", json={"daily_goal": 3}, headers=parent_h, timeout=15)
    assert r3.json()["daily_goal"] == 3
    # Verify persistence via GET /parent/children
    kids = s.get(f"{API}/parent/children", headers=parent_h).json()
    assert next(k for k in kids if k["id"] == kid_id)["daily_goal"] == 3


def test_set_goal_unauthorized_kid(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    solo_kid_id = accounts["solo_kid"]["user"]["id"]  # not linked
    r = s.post(f"{API}/parent/child/{solo_kid_id}/goal", json={"daily_goal": 2}, headers=parent_h, timeout=15)
    assert r.status_code == 404


# ---------- Auth/role guards ----------
def test_kid_cannot_access_parent_endpoints(s, accounts):
    kid_h = _h(accounts["solo_kid"]["token"])
    r = s.get(f"{API}/parent/children", headers=kid_h, timeout=15)
    assert r.status_code == 403
    r2 = s.get(f"{API}/parent/pending-posts", headers=kid_h, timeout=15)
    assert r2.status_code == 403


def test_parent_cannot_create_journal(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    r = s.post(f"{API}/journal", json={"text": "I love freedom fighters!"}, headers=parent_h, timeout=30)
    assert r.status_code == 403


# ---------- Journal: safe post by linked kid -> pending ----------
def test_journal_safe_linked_kid_pending(s, accounts):
    kid_h = _h(accounts["linked_kid"]["token"])
    r = s.post(
        f"{API}/journal",
        json={"text": "Bhagat Singh was very brave and inspires me to be honest and kind."},
        headers=kid_h,
        timeout=60,
    )
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["ok"] is True
    assert d["status"] == "pending", f"linked kid should be pending: {d}"
    # Should NOT show in feed yet
    feed = s.get(f"{API}/journal/feed", headers=kid_h, timeout=15).json()
    assert all(p["id"] != d["post"]["id"] for p in feed)
    # SHOULD show in /journal/mine
    mine = s.get(f"{API}/journal/mine", headers=kid_h, timeout=15).json()
    assert any(p["id"] == d["post"]["id"] and p["status"] == "pending" for p in mine)


# ---------- Journal: safe post by solo kid -> approved ----------
def test_journal_safe_solo_kid_approved_in_feed(s, accounts):
    kid_h = _h(accounts["solo_kid"]["token"])
    r = s.post(
        f"{API}/journal",
        json={"text": "Rani Lakshmibai shows me that girls can be strong and courageous leaders."},
        headers=kid_h,
        timeout=60,
    )
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["ok"] is True and d["status"] == "approved", d
    feed = s.get(f"{API}/journal/feed", headers=kid_h, timeout=15).json()
    assert any(p["id"] == d["post"]["id"] for p in feed)


# ---------- Journal: unsafe content rejected by AI ----------
def test_journal_unsafe_pii_rejected(s, accounts):
    kid_h = _h(accounts["solo_kid"]["token"])
    r = s.post(
        f"{API}/journal",
        json={"text": "Hi my name is Rohan Gupta, my phone number is 9876543210, and I live at 12 MG Road, Delhi."},
        headers=kid_h,
        timeout=60,
    )
    assert r.status_code == 200
    d = r.json()
    assert d["ok"] is False, f"expected rejection, got {d}"
    assert d["status"] == "rejected"
    assert d.get("reason")


# ---------- Reactions ----------
def test_reactions_toggle(s, accounts):
    # solo_kid has at least one approved post by now from prior test
    kid_h = _h(accounts["solo_kid"]["token"])
    feed = s.get(f"{API}/journal/feed", headers=kid_h, timeout=15).json()
    assert feed, "no approved posts in feed"
    pid = feed[0]["id"]
    r1 = s.post(f"{API}/journal/{pid}/react", json={"emoji": "🔥"}, headers=kid_h, timeout=15)
    assert r1.status_code == 200
    n1 = r1.json()["counts"]["🔥"]
    # Toggle off
    r2 = s.post(f"{API}/journal/{pid}/react", json={"emoji": "🔥"}, headers=kid_h, timeout=15)
    assert r2.json()["counts"]["🔥"] == n1 - 1
    # Invalid emoji
    rb = s.post(f"{API}/journal/{pid}/react", json={"emoji": "💩"}, headers=kid_h, timeout=15)
    assert rb.status_code == 400


# ---------- Pending posts visibility ----------
def test_pending_posts_only_own_children(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    pending = s.get(f"{API}/parent/pending-posts", headers=parent_h, timeout=15).json()
    linked_kid_id = accounts["linked_kid"]["user"]["id"]
    # all entries should belong to linked_kid (parent has only one linked kid)
    assert all(p["author_id"] == linked_kid_id for p in pending)
    assert len(pending) >= 1


# ---------- Moderate: approve + reject ----------
def test_parent_moderate_approve_then_reject(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    kid_h = _h(accounts["linked_kid"]["token"])

    # Create a fresh pending post
    r = s.post(
        f"{API}/journal",
        json={"text": "Mahatma Gandhi taught us non-violence. I will be kind to my friends today."},
        headers=kid_h,
        timeout=60,
    )
    assert r.status_code == 200 and r.json()["status"] == "pending"
    pid = r.json()["post"]["id"]

    # Approve
    ra = s.post(f"{API}/parent/posts/{pid}/moderate", json={"action": "approve"}, headers=parent_h, timeout=15)
    assert ra.status_code == 200 and ra.json()["status"] == "approved"

    # Now should appear in feed
    feed = s.get(f"{API}/journal/feed", headers=kid_h, timeout=15).json()
    assert any(p["id"] == pid for p in feed)

    # Should NOT be in pending list anymore
    pending_after = s.get(f"{API}/parent/pending-posts", headers=parent_h, timeout=15).json()
    assert all(p["id"] != pid for p in pending_after)

    # Create another and reject it
    r2 = s.post(
        f"{API}/journal",
        json={"text": "Subhas Chandra Bose said Jai Hind! That makes me feel proud."},
        headers=kid_h,
        timeout=60,
    )
    pid2 = r2.json()["post"]["id"]
    rj = s.post(f"{API}/parent/posts/{pid2}/moderate", json={"action": "reject"}, headers=parent_h, timeout=15)
    assert rj.status_code == 200 and rj.json()["status"] == "rejected"
    feed2 = s.get(f"{API}/journal/feed", headers=kid_h, timeout=15).json()
    assert all(p["id"] != pid2 for p in feed2)


def test_parent_cannot_moderate_other_kid_post(s, accounts):
    parent_h = _h(accounts["parent"]["token"])
    # solo_kid has approved posts; create a second parent and try to moderate solo_kid's post
    other_parent = _signup(s, f"test_parent_x_{TS}", role="parent")
    feed = s.get(f"{API}/journal/feed", headers=_h(accounts["solo_kid"]["token"]), timeout=15).json()
    pid = feed[0]["id"]
    r = s.post(
        f"{API}/parent/posts/{pid}/moderate",
        json={"action": "reject"},
        headers=_h(other_parent["token"]),
        timeout=15,
    )
    assert r.status_code == 403


# ---------- Journal length validation ----------
def test_journal_length_validation(s, accounts):
    kid_h = _h(accounts["solo_kid"]["token"])
    r1 = s.post(f"{API}/journal", json={"text": "hi"}, headers=kid_h, timeout=15)
    assert r1.status_code == 400
    r2 = s.post(f"{API}/journal", json={"text": "x" * 801}, headers=kid_h, timeout=15)
    assert r2.status_code == 400
