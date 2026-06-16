"""Azaadi Tales backend - FastAPI server."""
import os
import logging
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta, date
from pathlib import Path
from typing import List, Optional

from contextlib import asynccontextmanager
from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

from stories_seed import STORIES, BADGES, LEVELS, get_level_for_xp
from hunts_seed import HUNTS
from hero_visuals import HERO_VISUALS  # monument_id + portrait_prompt per hero

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret")
JWT_ALG = "HS256"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@asynccontextmanager
async def lifespan(app_: FastAPI):
    yield
    client.close()


app = FastAPI(title="Azaadi Tales API", lifespan=lifespan)
api = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)


# ---------- Models ----------
class SignupReq(BaseModel):
    username: str
    password: str
    age: int = 8
    avatar: str = "owl"
    language: str = "en"
    role: str = "kid"  # "kid" or "parent"


class LinkChildReq(BaseModel):
    child_username: str


class SetGoalReq(BaseModel):
    daily_goal: int = 1


class ModerateActionReq(BaseModel):
    action: str  # "approve" or "reject"


class JournalCreateReq(BaseModel):
    text: str
    story_id: Optional[str] = None


class ReactReq(BaseModel):
    emoji: str  # 🔥 💡 🌟


class HuntAnswerReq(BaseModel):
    clue_id: str
    answer_id: str  # the hero story_id the kid tapped


# Jigsaw puzzle config — 5 selected heroes' portraits.
JIGSAW_HEROES = [
    "sarojini-naidu",
    "bhimrao-ambedkar",
    "mahatma-gandhi",
    "tilak",
    "sardar-patel",
]
JIGSAW_GRID = 3  # 3x3 = 9 pieces
JIGSAW_XP_REWARD = 30
JIGSAW_BADGE = "jigsaw_master"


class LoginReq(BaseModel):
    username: str
    password: str


class ChatReq(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: str = "en"


class QuizSubmitReq(BaseModel):
    story_id: str
    answers: List[int]


class CompleteStoryReq(BaseModel):
    story_id: str


class UserOut(BaseModel):
    id: str
    username: str
    age: int
    avatar: str
    language: str
    xp: int
    level: int
    level_name: str
    badges: List[str]
    completed_stories: List[str]
    streak: int
    quizzes_taken: int
    role: str = "kid"
    parent_id: Optional[str] = None
    daily_goal: int = 1


# ---------- Auth helpers ----------
def hash_pw(pw: str) -> str:
    return bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()


def check_pw(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode(), hashed.encode())
    except Exception:
        return False


def make_token(user_id: str) -> str:
    payload = {"uid": user_id, "exp": datetime.now(timezone.utc) + timedelta(days=30)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Missing token")
    token = authorization.split(" ", 1)[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        uid = payload["uid"]
    except Exception:
        raise HTTPException(401, "Invalid token")
    user = await db.users.find_one({"id": uid}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(401, "User not found")
    return user


def serialize_user(u: dict) -> UserOut:
    lvl = get_level_for_xp(u.get("xp", 0))
    return UserOut(
        id=u["id"],
        username=u["username"],
        age=u.get("age", 8),
        avatar=u.get("avatar", "owl"),
        language=u.get("language", "en"),
        xp=u.get("xp", 0),
        level=lvl["level"],
        level_name=lvl["name"],
        badges=u.get("badges", []),
        completed_stories=u.get("completed_stories", []),
        streak=u.get("streak", 0),
        quizzes_taken=u.get("quizzes_taken", 0),
        role=u.get("role", "kid"),
        parent_id=u.get("parent_id"),
        daily_goal=u.get("daily_goal", 1),
    )


async def update_streak(user: dict):
    today = date.today().isoformat()
    last = user.get("last_active")
    streak = user.get("streak", 0)
    if last == today:
        return streak
    if last:
        last_d = date.fromisoformat(last)
        if (date.today() - last_d).days == 1:
            streak += 1
        else:
            streak = 1
    else:
        streak = 1
    await db.users.update_one(
        {"id": user["id"]},
        {"$set": {"last_active": today, "streak": streak}},
    )
    return streak


async def maybe_award_badges(user_id: str):
    u = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not u:
        return
    badges = set(u.get("badges", []))
    completed = u.get("completed_stories", [])
    quizzes_taken = u.get("quizzes_taken", 0)
    perfect_quizzes = u.get("perfect_quizzes", 0)
    streak = u.get("streak", 0)
    chatted = u.get("chatted", False)

    if completed and "first_story" not in badges:
        badges.add("first_story")
    if len(completed) >= 5:
        badges.add("five_stories")
    if len(completed) >= len(STORIES):
        badges.add("all_stories")
    if perfect_quizzes >= 1:
        badges.add("perfect_quiz")
    if quizzes_taken >= 3:
        badges.add("three_quizzes")
    if streak >= 3:
        badges.add("streak_3")
    if chatted:
        badges.add("chat_azaadi")

    if set(u.get("badges", [])) != badges:
        await db.users.update_one({"id": user_id}, {"$set": {"badges": list(badges)}})


# ---------- Routes ----------
@api.get("/")
async def root():
    return {"app": "Azaadi Tales", "status": "ok"}


@api.post("/auth/signup")
async def signup(req: SignupReq):
    username = req.username.strip().lower()
    if len(username) < 3 or len(req.password) < 4:
        raise HTTPException(400, "Username/password too short")
    existing = await db.users.find_one({"username": username})
    if existing:
        raise HTTPException(400, "Username already taken")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "username": username,
        "password_hash": hash_pw(req.password),
        "age": req.age,
        "avatar": req.avatar,
        "language": req.language,
        "xp": 0,
        "badges": [],
        "completed_stories": [],
        "streak": 0,
        "last_active": None,
        "quizzes_taken": 0,
        "perfect_quizzes": 0,
        "chatted": False,
        "role": req.role if req.role in ("kid", "parent") else "kid",
        "parent_id": None,
        "daily_goal": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(dict(user_doc))
    user_doc.pop("password_hash", None)
    user_doc.pop("_id", None)
    token = make_token(user_id)
    return {"token": token, "user": serialize_user(user_doc).model_dump()}


@api.post("/auth/login")
async def login(req: LoginReq):
    username = req.username.strip().lower()
    user = await db.users.find_one({"username": username})
    if not user or not check_pw(req.password, user.get("password_hash", "")):
        raise HTTPException(401, "Invalid credentials")
    user.pop("password_hash", None)
    user.pop("_id", None)
    token = make_token(user["id"])
    return {"token": token, "user": serialize_user(user).model_dump()}


@api.get("/me")
async def me(user=Depends(get_current_user)):
    await update_streak(user)
    user = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return serialize_user(user).model_dump()


@api.get("/stories")
async def list_stories():
    return [
        {
            "id": s["id"],
            "name": s["name"],
            "title_en": s["title_en"],
            "title_hi": s["title_hi"],
            "tagline_en": s["tagline_en"],
            "tagline_hi": s["tagline_hi"],
            "era": s["era"],
            "color": s["color"],
        }
        for s in STORIES
    ]


@api.get("/stories/{story_id}")
async def get_story(story_id: str):
    s = next((x for x in STORIES if x["id"] == story_id), None)
    if not s:
        raise HTTPException(404, "Story not found")
    vis = HERO_VISUALS.get(story_id, {})
    return {
        "id": s["id"],
        "name": s["name"],
        "title_en": s["title_en"],
        "title_hi": s["title_hi"],
        "tagline_en": s["tagline_en"],
        "tagline_hi": s["tagline_hi"],
        "era": s["era"],
        "color": s["color"],
        "story_en": s["story_en"],
        "story_hi": s["story_hi"],
        "lessons_en": s.get("lessons_en", []),
        "lessons_hi": s.get("lessons_hi", []),
        "monument": vis.get("monument", "red_fort"),
        "has_portrait": True,  # client should try the portrait endpoint; falls back to initials
    }


@api.get("/stories/{story_id}/portrait")
async def get_story_portrait(story_id: str):
    """Return a cached AI-generated portrait of the hero as PNG.

    First call may take ~5-10s as it generates and caches. Subsequent calls are
    instant (served from MongoDB).
    """
    from fastapi.responses import Response

    s = next((x for x in STORIES if x["id"] == story_id), None)
    if not s:
        raise HTTPException(404, "Story not found")
    vis = HERO_VISUALS.get(story_id)
    if not vis or not vis.get("portrait_prompt"):
        raise HTTPException(404, "No portrait prompt configured")

    # Try cache first
    cached = await db.portraits.find_one({"story_id": story_id})
    if cached and cached.get("png_b64"):
        png_bytes = __import__("base64").b64decode(cached["png_b64"])
        mime = cached.get("mime_type") or "image/png"
        return Response(content=png_bytes, media_type=mime, headers={"Cache-Control": "public, max-age=2592000"})

    # Generate fresh
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"portrait-{story_id}",
            system_message="You are an artist making warm illustrated portraits for a children's history app.",
        ).with_model("gemini", "gemini-3.1-flash-image-preview").with_params(modalities=["image", "text"])
        msg = UserMessage(text=vis["portrait_prompt"])
        _txt, images = await chat.send_message_multimodal_response(msg)
        if not images:
            raise RuntimeError("No image returned")
        png_b64 = images[0]["data"]
        await db.portraits.update_one(
            {"story_id": story_id},
            {"$set": {
                "story_id": story_id,
                "png_b64": png_b64,
                "mime_type": images[0].get("mime_type", "image/png"),
                "created_at": datetime.now(timezone.utc).isoformat(),
            }},
            upsert=True,
        )
        png_bytes = __import__("base64").b64decode(png_b64)
        return Response(content=png_bytes, media_type="image/png", headers={"Cache-Control": "public, max-age=2592000"})
    except Exception as e:
        log.exception("Gemini portrait failed for %s, trying Pollinations.ai fallback", story_id)
        # ---- Pollinations.ai fallback (free, no key) ----
        try:
            import httpx
            from urllib.parse import quote
            seed = abs(hash(story_id)) % 100000
            url = (
                f"https://image.pollinations.ai/prompt/{quote(vis['portrait_prompt'])}"
                f"?width=512&height=512&nologo=true&seed={seed}"
            )
            async with httpx.AsyncClient(timeout=60.0, follow_redirects=True) as cli:
                r = await cli.get(url)
                r.raise_for_status()
                png_bytes = r.content
                if not png_bytes or len(png_bytes) < 1000:
                    raise RuntimeError("Empty image from Pollinations")
                png_b64 = __import__("base64").b64encode(png_bytes).decode()
                await db.portraits.update_one(
                    {"story_id": story_id},
                    {"$set": {
                        "story_id": story_id,
                        "png_b64": png_b64,
                        "mime_type": "image/jpeg",
                        "source": "pollinations",
                        "created_at": datetime.now(timezone.utc).isoformat(),
                    }},
                    upsert=True,
                )
                return Response(
                    content=png_bytes,
                    media_type="image/jpeg",
                    headers={"Cache-Control": "public, max-age=2592000"},
                )
        except Exception as e2:
            log.exception("Pollinations fallback also failed for %s", story_id)
            raise HTTPException(503, f"Portrait generation temporarily unavailable")


@api.post("/admin/regenerate-portrait/{story_id}")
async def admin_regenerate_portrait(story_id: str, user=Depends(get_current_user)):
    """Delete the cached portrait so next GET will regenerate. Auth-protected.
    Any logged-in user can trigger; safe because the generation is idempotent
    and rate-limited by the LLM provider."""
    await db.portraits.delete_one({"story_id": story_id})
    return {"ok": True, "story_id": story_id}


@api.get("/stories/{story_id}/quiz")
async def get_quiz(story_id: str):
    s = next((x for x in STORIES if x["id"] == story_id), None)
    if not s:
        raise HTTPException(404, "Story not found")
    # don't expose answers
    return [
        {
            "q_en": q["q_en"],
            "q_hi": q["q_hi"],
            "options_en": q["options_en"],
            "options_hi": q["options_hi"],
        }
        for q in s["quiz"]
    ]


@api.post("/stories/complete")
async def complete_story(req: CompleteStoryReq, user=Depends(get_current_user)):
    s = next((x for x in STORIES if x["id"] == req.story_id), None)
    if not s:
        raise HTTPException(404, "Story not found")
    completed = set(user.get("completed_stories", []))
    award = 0
    if req.story_id not in completed:
        completed.add(req.story_id)
        award = 20
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"completed_stories": list(completed)}, "$inc": {"xp": award}},
        )
    await update_streak(user)
    await maybe_award_badges(user["id"])
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return {"xp_awarded": award, "user": serialize_user(fresh).model_dump()}


@api.post("/quiz/submit")
async def submit_quiz(req: QuizSubmitReq, user=Depends(get_current_user)):
    s = next((x for x in STORIES if x["id"] == req.story_id), None)
    if not s:
        raise HTTPException(404, "Story not found")
    quiz = s["quiz"]
    if len(req.answers) != len(quiz):
        raise HTTPException(400, "Answer count mismatch")
    correct = sum(1 for i, ans in enumerate(req.answers) if ans == quiz[i]["answer"])
    total = len(quiz)
    pct = round(correct * 100 / total)
    award = correct * 5 + (15 if correct == total else 0)
    inc = {"xp": award, "quizzes_taken": 1}
    if correct == total:
        inc["perfect_quizzes"] = 1
    await db.users.update_one({"id": user["id"]}, {"$inc": inc})
    await update_streak(user)
    await maybe_award_badges(user["id"])
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    correct_answers = [q["answer"] for q in quiz]
    return {
        "correct": correct,
        "total": total,
        "percent": pct,
        "xp_awarded": award,
        "correct_answers": correct_answers,
        "user": serialize_user(fresh).model_dump(),
    }


@api.post("/chat")
async def chat_with_azaadi(req: ChatReq, user=Depends(get_current_user)):
    from emergentintegrations.llm.chat import LlmChat, UserMessage

    session_id = req.session_id or f"azaadi-{user['id']}"
    lang_instr = (
        "Reply in Hindi (Devanagari script). Use simple, kid-friendly Hindi."
        if req.language == "hi"
        else "Reply in simple, friendly English suitable for kids aged 5-14."
    )
    system_msg = (
        "You are Veer, a brave, kind, and playful young Indian friend (a child holding the Indian flag) "
        "who tells children aged 5-14 the inspiring stories of India's freedom fighters: Bhagat Singh, "
        "Rani Lakshmibai, Mahatma Gandhi, Subhas Chandra Bose, Sarojini Naidu, Chandrashekhar Azad, "
        "Mangal Pandey, Dr. B. R. Ambedkar, and many others. You answer questions warmly, share fascinating "
        "stories, and inspire courage, honesty, and patriotism. Always be safe, age-appropriate, "
        "encouraging, and never scary. Keep replies short (2-4 sentences) with a friendly, proud, "
        "enthusiastic tone. End some replies with 'Jai Hind!' "
        f"{lang_instr}"
    )
    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=system_msg,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    try:
        reply = await chat.send_message(UserMessage(text=req.message))
    except Exception as e:
        log.exception("Chat error")
        raise HTTPException(500, f"Veer is taking a quick break: {e}")

    msg_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "session_id": session_id,
        "user_text": req.message,
        "azaadi_text": reply,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.chat_messages.insert_one(dict(msg_doc))
    msg_doc.pop("_id", None)

    if not user.get("chatted"):
        await db.users.update_one({"id": user["id"]}, {"$set": {"chatted": True}})
        await maybe_award_badges(user["id"])

    return {"reply": reply, "session_id": session_id}


@api.get("/chat/history")
async def chat_history(user=Depends(get_current_user)):
    msgs = (
        await db.chat_messages.find({"user_id": user["id"]}, {"_id": 0})
        .sort("created_at", 1)
        .to_list(200)
    )
    return msgs


@api.get("/badges")
async def all_badges():
    return BADGES


@api.get("/levels")
async def all_levels():
    return LEVELS


# ---------- Parent Dashboard ----------
def require_parent(user: dict):
    if user.get("role") != "parent":
        raise HTTPException(403, "Parents only")


def require_kid(user: dict):
    if user.get("role", "kid") != "kid":
        raise HTTPException(403, "Kids only")


async def _serialize_kid_for_parent(kid: dict) -> dict:
    base = serialize_user(kid).model_dump()
    base["last_active"] = kid.get("last_active")
    return base


@api.get("/parent/children")
async def list_children(user=Depends(get_current_user)):
    require_parent(user)
    kids = await db.users.find({"parent_id": user["id"]}, {"_id": 0, "password_hash": 0}).to_list(50)
    return [await _serialize_kid_for_parent(k) for k in kids]


@api.post("/parent/link-child")
async def link_child(req: LinkChildReq, user=Depends(get_current_user)):
    require_parent(user)
    uname = req.child_username.strip().lower()
    kid = await db.users.find_one({"username": uname})
    if not kid:
        raise HTTPException(404, "No kid found with that username")
    if kid.get("role", "kid") != "kid":
        raise HTTPException(400, "That account is not a kid account")
    if kid.get("parent_id") and kid.get("parent_id") != user["id"]:
        raise HTTPException(400, "Kid is already linked to another parent")
    await db.users.update_one({"id": kid["id"]}, {"$set": {"parent_id": user["id"]}})
    fresh = await db.users.find_one({"id": kid["id"]}, {"_id": 0, "password_hash": 0})
    return {"ok": True, "child": await _serialize_kid_for_parent(fresh)}


@api.post("/parent/child/{kid_id}/goal")
async def set_child_goal(kid_id: str, req: SetGoalReq, user=Depends(get_current_user)):
    require_parent(user)
    kid = await db.users.find_one({"id": kid_id})
    if not kid or kid.get("parent_id") != user["id"]:
        raise HTTPException(404, "Child not found")
    goal = max(1, min(10, req.daily_goal))
    await db.users.update_one({"id": kid_id}, {"$set": {"daily_goal": goal}})
    return {"ok": True, "daily_goal": goal}


@api.get("/parent/child/{kid_id}/progress")
async def child_progress(kid_id: str, user=Depends(get_current_user)):
    require_parent(user)
    kid = await db.users.find_one({"id": kid_id}, {"_id": 0, "password_hash": 0})
    if not kid or kid.get("parent_id") != user["id"]:
        raise HTTPException(404, "Child not found")
    posts = await db.journal.count_documents({"author_id": kid_id})
    chats = await db.chat_messages.count_documents({"user_id": kid_id})
    return {
        "child": await _serialize_kid_for_parent(kid),
        "posts_written": posts,
        "azaadi_chats": chats,
    }


# ---------- Community Freedom Journal ----------
async def _moderate_post(text: str) -> dict:
    """Use Claude to decide if the kid post is safe/appropriate. Returns {safe: bool, reason: str}."""
    from emergentintegrations.llm.chat import LlmChat, UserMessage
    sys_msg = (
        "You moderate posts written by Indian children aged 5-14 in a school-safe app called Azaadi Tales. "
        "Reply ONLY with one word followed by a short reason. "
        "If the post contains personal info (full names, phone, address, school name), violence, hate speech, bullying, "
        "profanity, or anything not appropriate for kids, reply: UNSAFE: <short reason in 6 words or less>. "
        "If the post is safe, encouraging, or simply childish/silly, reply: SAFE: <2-4 word reason>. "
        "If unsure, default to UNSAFE."
    )
    chat = LlmChat(api_key=EMERGENT_LLM_KEY, session_id=f"mod-{uuid.uuid4()}", system_message=sys_msg).with_model(
        "anthropic", "claude-sonnet-4-5-20250929"
    )
    try:
        reply = await chat.send_message(UserMessage(text=f"Post to moderate:\n\"\"\"\n{text}\n\"\"\""))
        reply_clean = reply.strip().upper()
        if reply_clean.startswith("SAFE"):
            return {"safe": True, "reason": reply.split(":", 1)[1].strip() if ":" in reply else "Looks good"}
        return {"safe": False, "reason": reply.split(":", 1)[1].strip() if ":" in reply else "Not appropriate"}
    except Exception as e:
        log.exception("Moderation error")
        return {"safe": False, "reason": f"Moderation unavailable"}


def _serialize_post(p: dict) -> dict:
    out = dict(p)
    out.pop("_id", None)
    out["reactions_count"] = {emoji: len(uids) for emoji, uids in (p.get("reactions") or {}).items()}
    out.pop("reactions", None)
    return out


@api.post("/journal")
async def create_journal_post(req: JournalCreateReq, user=Depends(get_current_user)):
    require_kid(user)
    text = req.text.strip()
    if len(text) < 5 or len(text) > 800:
        raise HTTPException(400, "Reflection should be 5-800 characters")

    mod = await _moderate_post(text)
    if not mod["safe"]:
        return {
            "ok": False,
            "status": "rejected",
            "reason": mod["reason"],
            "message": "Veer gently asked you to rewrite this 🇮🇳",
        }

    has_parent = bool(user.get("parent_id"))
    status = "pending" if has_parent else "approved"
    post_doc = {
        "id": str(uuid.uuid4()),
        "author_id": user["id"],
        "author_username": user["username"],
        "author_avatar": user.get("avatar", "🇮🇳"),
        "story_id": req.story_id,
        "text": text,
        "status": status,
        "moderation_reason": mod["reason"],
        "reactions": {"🔥": [], "💡": [], "🌟": []},
        "created_at": datetime.now(timezone.utc).isoformat(),
        "approved_at": datetime.now(timezone.utc).isoformat() if status == "approved" else None,
    }
    await db.journal.insert_one(dict(post_doc))
    return {"ok": True, "status": status, "post": _serialize_post(post_doc)}


@api.get("/journal/feed")
async def journal_feed(user=Depends(get_current_user)):
    posts = (
        await db.journal.find({"status": "approved"}, {"_id": 0})
        .sort("approved_at", -1)
        .to_list(100)
    )
    out = []
    for p in posts:
        s = _serialize_post(p)
        s["mine"] = p["author_id"] == user["id"]
        out.append(s)
    return out


@api.get("/journal/mine")
async def my_journal(user=Depends(get_current_user)):
    posts = (
        await db.journal.find({"author_id": user["id"]}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(100)
    )
    return [_serialize_post(p) for p in posts]


@api.post("/journal/{post_id}/react")
async def react_to_post(post_id: str, req: ReactReq, user=Depends(get_current_user)):
    if req.emoji not in ("🔥", "💡", "🌟"):
        raise HTTPException(400, "Invalid reaction")
    post = await db.journal.find_one({"id": post_id})
    if not post or post.get("status") != "approved":
        raise HTTPException(404, "Post not found")
    reactions = post.get("reactions") or {"🔥": [], "💡": [], "🌟": []}
    uids = list(reactions.get(req.emoji, []))
    if user["id"] in uids:
        uids.remove(user["id"])  # toggle off
    else:
        uids.append(user["id"])
    reactions[req.emoji] = uids
    await db.journal.update_one({"id": post_id}, {"$set": {"reactions": reactions}})
    return {"ok": True, "counts": {e: len(v) for e, v in reactions.items()}}


@api.get("/parent/pending-posts")
async def pending_posts(user=Depends(get_current_user)):
    require_parent(user)
    kids = await db.users.find({"parent_id": user["id"]}, {"id": 1, "_id": 0}).to_list(50)
    kid_ids = [k["id"] for k in kids]
    posts = (
        await db.journal.find({"author_id": {"$in": kid_ids}, "status": "pending"}, {"_id": 0})
        .sort("created_at", -1)
        .to_list(100)
    )
    return [_serialize_post(p) for p in posts]


@api.post("/parent/posts/{post_id}/moderate")
async def parent_moderate(post_id: str, req: ModerateActionReq, user=Depends(get_current_user)):
    require_parent(user)
    post = await db.journal.find_one({"id": post_id})
    if not post:
        raise HTTPException(404, "Post not found")
    kid = await db.users.find_one({"id": post["author_id"]})
    if not kid or kid.get("parent_id") != user["id"]:
        raise HTTPException(403, "Not your child's post")
    new_status = "approved" if req.action == "approve" else "rejected"
    update = {"status": new_status}
    if new_status == "approved":
        update["approved_at"] = datetime.now(timezone.utc).isoformat()
    await db.journal.update_one({"id": post_id}, {"$set": update})
    return {"ok": True, "status": new_status}




# ---------- Treasure Hunts ----------
def _hero_card(story_id: str) -> dict:
    """Build a small hero card from a story_id (name + color + initials emoji)."""
    s = next((x for x in STORIES if x["id"] == story_id), None)
    if not s:
        return {"id": story_id, "name": story_id, "color": "#888"}
    return {
        "id": s["id"],
        "name": s["name"],
        "color": s["color"],
        "tagline_en": s.get("tagline_en", ""),
        "tagline_hi": s.get("tagline_hi", ""),
        "era": s.get("era", ""),
    }


def _public_clue(clue: dict) -> dict:
    return {
        "id": clue["id"],
        "clue_en": clue["clue_en"],
        "clue_hi": clue["clue_hi"],
        "options": [_hero_card(sid) for sid in clue["options"]],
        "hint_en": clue.get("hint_en", ""),
        "hint_hi": clue.get("hint_hi", ""),
    }


async def _get_hunt_progress(user_id: str, hunt_id: str) -> dict:
    """Return progress doc {solved_clues: [...], completed: bool}. Creates if missing."""
    doc = await db.hunt_progress.find_one({"user_id": user_id, "hunt_id": hunt_id})
    if not doc:
        return {"user_id": user_id, "hunt_id": hunt_id, "solved_clues": [], "completed": False, "wrong_attempts": 0}
    doc.pop("_id", None)
    return doc


@api.get("/hunts")
async def list_hunts(user=Depends(get_current_user)):
    """Returns all hunts with this kid's progress summary."""
    out = []
    for h in HUNTS:
        prog = await _get_hunt_progress(user["id"], h["id"])
        total = len(h["clues"])
        solved = len(prog.get("solved_clues", []))
        out.append({
            "id": h["id"],
            "title_en": h["title_en"],
            "title_hi": h["title_hi"],
            "tagline_en": h["tagline_en"],
            "tagline_hi": h["tagline_hi"],
            "icon": h["icon"],
            "color": h["color"],
            "badge_id": h["badge_id"],
            "xp_reward": h["xp_reward"],
            "total_clues": total,
            "solved_clues": solved,
            "completed": prog.get("completed", False),
            "percent": round(solved * 100 / total) if total else 0,
        })
    return out


@api.get("/hunts/{hunt_id}")
async def get_hunt(hunt_id: str, user=Depends(get_current_user)):
    """Returns full hunt: all clues + 4 hero options each + this kid's progress.
    Answers are NOT exposed; client submits each answer to /hunts/{id}/answer."""
    hunt = next((h for h in HUNTS if h["id"] == hunt_id), None)
    if not hunt:
        raise HTTPException(404, "Hunt not found")
    prog = await _get_hunt_progress(user["id"], hunt_id)
    clues = [_public_clue(c) for c in hunt["clues"]]
    return {
        "id": hunt["id"],
        "title_en": hunt["title_en"],
        "title_hi": hunt["title_hi"],
        "tagline_en": hunt["tagline_en"],
        "tagline_hi": hunt["tagline_hi"],
        "icon": hunt["icon"],
        "color": hunt["color"],
        "badge_id": hunt["badge_id"],
        "xp_reward": hunt["xp_reward"],
        "clues": clues,
        "solved_clues": prog.get("solved_clues", []),
        "completed": prog.get("completed", False),
    }


@api.post("/hunts/{hunt_id}/answer")
async def answer_hunt_clue(hunt_id: str, req: HuntAnswerReq, user=Depends(get_current_user)):
    """Validate the kid's tap-the-hero answer for one clue."""
    hunt = next((h for h in HUNTS if h["id"] == hunt_id), None)
    if not hunt:
        raise HTTPException(404, "Hunt not found")
    clue = next((c for c in hunt["clues"] if c["id"] == req.clue_id), None)
    if not clue:
        raise HTTPException(404, "Clue not found")

    is_correct = (req.answer_id == clue["answer_id"])
    correct_hero = _hero_card(clue["answer_id"])

    prog = await _get_hunt_progress(user["id"], hunt_id)
    solved = list(prog.get("solved_clues", []))
    wrong_attempts = int(prog.get("wrong_attempts", 0))
    awarded_clue_xp = 0
    just_completed = False
    badge_awarded = None
    bonus_xp = 0

    if is_correct and req.clue_id not in solved:
        solved.append(req.clue_id)
        awarded_clue_xp = 5  # small XP per clue
        await db.users.update_one({"id": user["id"]}, {"$inc": {"xp": awarded_clue_xp}})

    if not is_correct:
        wrong_attempts += 1

    completed_now = (len(solved) == len(hunt["clues"]))
    if completed_now and not prog.get("completed", False):
        just_completed = True
        bonus_xp = int(hunt.get("xp_reward", 0))
        await db.users.update_one({"id": user["id"]}, {"$inc": {"xp": bonus_xp}})
        # Award badge
        u = await db.users.find_one({"id": user["id"]}, {"_id": 0})
        b = set(u.get("badges", []))
        if hunt["badge_id"] not in b:
            b.add(hunt["badge_id"])
            await db.users.update_one({"id": user["id"]}, {"$set": {"badges": list(b)}})
            badge_awarded = hunt["badge_id"]

    await db.hunt_progress.update_one(
        {"user_id": user["id"], "hunt_id": hunt_id},
        {"$set": {
            "user_id": user["id"],
            "hunt_id": hunt_id,
            "solved_clues": solved,
            "completed": completed_now or prog.get("completed", False),
            "wrong_attempts": wrong_attempts,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
    await update_streak(user)
    await maybe_award_badges(user["id"])

    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return {
        "correct": is_correct,
        "correct_hero": correct_hero,
        "solved_clues": solved,
        "completed": completed_now,
        "just_completed": just_completed,
        "xp_awarded": awarded_clue_xp + bonus_xp,
        "badge_awarded": badge_awarded,
        "user": serialize_user(fresh).model_dump(),
    }


# ---------- Jigsaw Puzzles ----------
@api.get("/jigsaw")
async def list_jigsaw(user=Depends(get_current_user)):
    """5 selected freedom-fighter portraits as 3x3 jigsaw puzzles."""
    solved_set = set((user.get("jigsaw_solved") or []))
    out = []
    for sid in JIGSAW_HEROES:
        s = next((x for x in STORIES if x["id"] == sid), None)
        if not s:
            continue
        out.append({
            "id": sid,
            "name": s["name"],
            "title_en": s["title_en"],
            "title_hi": s["title_hi"],
            "color": s["color"],
            "era": s["era"],
            "portrait_url": f"/api/stories/{sid}/portrait",
            "grid": JIGSAW_GRID,
            "xp_reward": JIGSAW_XP_REWARD,
            "solved": sid in solved_set,
        })
    return out


@api.post("/jigsaw/{story_id}/complete")
async def complete_jigsaw(story_id: str, user=Depends(get_current_user)):
    if story_id not in JIGSAW_HEROES:
        raise HTTPException(404, "Not a jigsaw puzzle")
    u = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    solved = list(u.get("jigsaw_solved") or [])
    just_solved = False
    xp_awarded = 0
    if story_id not in solved:
        solved.append(story_id)
        just_solved = True
        xp_awarded = JIGSAW_XP_REWARD
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"jigsaw_solved": solved}, "$inc": {"xp": xp_awarded}},
        )
    badge_awarded = None
    # Award master badge when all 5 are solved
    if set(solved) >= set(JIGSAW_HEROES):
        u2 = await db.users.find_one({"id": user["id"]}, {"_id": 0})
        b = set(u2.get("badges", []))
        if JIGSAW_BADGE not in b:
            b.add(JIGSAW_BADGE)
            await db.users.update_one({"id": user["id"]}, {"$set": {"badges": list(b)}})
            badge_awarded = JIGSAW_BADGE
    await update_streak(user)
    await maybe_award_badges(user["id"])
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return {
        "just_solved": just_solved,
        "xp_awarded": xp_awarded,
        "badge_awarded": badge_awarded,
        "solved_count": len(solved),
        "total": len(JIGSAW_HEROES),
        "user": serialize_user(fresh).model_dump(),
    }


# ===================== Freedom Map of India =====================
from freedom_map import (
    get_freedom_map_data, FREEDOM_MAP_TOTAL,
    FREEDOM_MAP_BADGE, FREEDOM_MAP_XP_PER_DISCOVERY,
)
from battle_cries import (
    BATTLE_CRIES, BATTLE_CRY_BADGE_PREFIX, BATTLE_CRY_XP_PER_COMPLETION,
    FREEDOM_VOICE_BADGE, FREEDOM_VOICE_THRESHOLD,
    all_cries, has_cry, get_cry,
)


@api.get("/freedom-map")
async def freedom_map_list(user=Depends(get_current_user)):
    """All 35 freedom fighters across India with x/y coords for the map."""
    discovered = set(user.get("discovered_heroes") or [])
    heroes = get_freedom_map_data()
    # Enrich with portrait_url (from existing story portrait when available)
    for h in heroes:
        h["discovered"] = h["hero_id"] in discovered
        if h["has_story"]:
            h["portrait_url"] = f"/api/stories/{h['story_id']}/portrait"
        else:
            # Pollinations.ai free portrait fallback (cached client-side)
            from urllib.parse import quote
            prompt = (
                f"{h['name']}, Indian freedom fighter from {h['state']}, "
                "warm watercolor children's storybook portrait, soft pastel saffron and green tones, "
                "kind expression, head and shoulders, traditional Indian attire, "
                "vintage hand-painted illustration"
            )
            h["portrait_url"] = (
                f"https://image.pollinations.ai/prompt/{quote(prompt)}"
                f"?width=512&height=512&nologo=true&seed={abs(hash(h['hero_id'])) % 100000}"
            )
    return {
        "heroes": heroes,
        "discovered_count": len([h for h in heroes if h["discovered"]]),
        "total": FREEDOM_MAP_TOTAL,
    }


class DiscoverReq(BaseModel):
    pass


@api.post("/freedom-map/discover/{hero_id}")
async def freedom_map_discover(hero_id: str, user=Depends(get_current_user)):
    valid_ids = {h["hero_id"] for h in get_freedom_map_data()}
    if hero_id not in valid_ids:
        raise HTTPException(404, "Hero not on the freedom map")
    u = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    discovered = list(u.get("discovered_heroes") or [])
    just_discovered = False
    xp_awarded = 0
    if hero_id not in discovered:
        discovered.append(hero_id)
        just_discovered = True
        xp_awarded = FREEDOM_MAP_XP_PER_DISCOVERY
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"discovered_heroes": discovered}, "$inc": {"xp": xp_awarded}},
        )
    badge_awarded = None
    # Award explorer badge when all heroes are found
    if len(discovered) >= FREEDOM_MAP_TOTAL:
        u2 = await db.users.find_one({"id": user["id"]}, {"_id": 0})
        b = set(u2.get("badges", []))
        if FREEDOM_MAP_BADGE not in b:
            b.add(FREEDOM_MAP_BADGE)
            await db.users.update_one({"id": user["id"]}, {"$set": {"badges": list(b)}})
            badge_awarded = FREEDOM_MAP_BADGE
    await update_streak(user)
    await maybe_award_badges(user["id"])
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return {
        "just_discovered": just_discovered,
        "xp_awarded": xp_awarded,
        "badge_awarded": badge_awarded,
        "discovered_count": len(discovered),
        "total": FREEDOM_MAP_TOTAL,
        "user": serialize_user(fresh).model_dump(),
    }


# ===================== Battle Cries =====================
@api.get("/battle-cries")
async def battle_cries_list(user=Depends(get_current_user)):
    """List all 15 battle cries with the user's completion status."""
    done = list(user.get("battle_cries_done") or [])
    items = []
    for c in all_cries():
        hid = c["hero_id"]
        # Pull the hero name & color from the stories catalog for display
        s = next((x for x in STORIES if x["id"] == hid), None)
        items.append({
            **c,
            "hero_name": (s or {}).get("name", hid.replace("-", " ").title()),
            "hero_color": (s or {}).get("color", "#FF7A1A"),
            "portrait_url": f"/api/stories/{hid}/portrait" if s else None,
            "completed": hid in done,
            "badge_id": f"{BATTLE_CRY_BADGE_PREFIX}{hid}",
        })
    return {
        "cries": items,
        "completed_count": len(done),
        "total": len(items),
        "freedom_voice_unlocked": FREEDOM_VOICE_BADGE in (user.get("badges") or []),
        "freedom_voice_threshold": FREEDOM_VOICE_THRESHOLD,
    }


@api.get("/battle-cries/{hero_id}")
async def battle_cry_one(hero_id: str, user=Depends(get_current_user)):
    if not has_cry(hero_id):
        raise HTTPException(404, "No battle cry for this hero")
    c = get_cry(hero_id)
    s = next((x for x in STORIES if x["id"] == hero_id), None)
    done = list(user.get("battle_cries_done") or [])
    return {
        "hero_id": hero_id,
        "hero_name": (s or {}).get("name", hero_id.replace("-", " ").title()),
        "hero_color": (s or {}).get("color", "#FF7A1A"),
        "portrait_url": f"/api/stories/{hero_id}/portrait" if s else None,
        "cry": c["cry"],
        "meaning": c["meaning"],
        "origin": c.get("origin", ""),
        "completed": hero_id in done,
        "badge_id": f"{BATTLE_CRY_BADGE_PREFIX}{hero_id}",
    }


@api.post("/battle-cries/{hero_id}/complete")
async def battle_cry_complete(hero_id: str, user=Depends(get_current_user)):
    if not has_cry(hero_id):
        raise HTTPException(404, "No battle cry for this hero")
    u = await db.users.find_one({"id": user["id"]}, {"_id": 0})
    done = list(u.get("battle_cries_done") or [])
    badges = set(u.get("badges") or [])
    just_completed = False
    xp_awarded = 0
    badge_awarded = None
    cry_badge = f"{BATTLE_CRY_BADGE_PREFIX}{hero_id}"
    if hero_id not in done:
        done.append(hero_id)
        just_completed = True
        xp_awarded = BATTLE_CRY_XP_PER_COMPLETION
        badges.add(cry_badge)
        badge_awarded = cry_badge
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"battle_cries_done": done, "badges": list(badges)},
             "$inc": {"xp": xp_awarded}},
        )
    # Award mega-badge at threshold
    freedom_voice_awarded = None
    if len(done) >= FREEDOM_VOICE_THRESHOLD and FREEDOM_VOICE_BADGE not in badges:
        badges.add(FREEDOM_VOICE_BADGE)
        await db.users.update_one(
            {"id": user["id"]},
            {"$set": {"badges": list(badges)}},
        )
        freedom_voice_awarded = FREEDOM_VOICE_BADGE
    await update_streak(user)
    await maybe_award_badges(user["id"])
    fresh = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password_hash": 0})
    return {
        "just_completed": just_completed,
        "xp_awarded": xp_awarded,
        "badge_awarded": badge_awarded,
        "freedom_voice_awarded": freedom_voice_awarded,
        "completed_count": len(done),
        "total": len(BATTLE_CRIES),
        "user": serialize_user(fresh).model_dump(),
    }


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db():
    client.close()
