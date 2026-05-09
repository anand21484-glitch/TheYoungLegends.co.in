"""Azaadi Tales backend - FastAPI server."""
import os
import logging
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta, date
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field

from stories_seed import STORIES, BADGES, LEVELS, get_level_for_xp

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
JWT_SECRET = os.environ.get("JWT_SECRET", "dev-secret")
JWT_ALG = "HS256"

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Azaadi Tales API")
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
    }


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
        "You are Azaadi, a wise, gentle, and playful owl mascot for Indian children aged 5-14. "
        "You teach them about India's freedom fighters: Bhagat Singh, Rani Lakshmibai, Mahatma Gandhi, "
        "Subhas Chandra Bose, Sarojini Naidu, Chandrashekhar Azad, Mangal Pandey, Dr. B. R. Ambedkar, "
        "and others. You answer questions warmly, share fascinating stories, and inspire courage, "
        "honesty, and patriotism. Always be safe, age-appropriate, encouraging, and never scary. "
        "Keep replies short (2-4 sentences) and use a hoot-y, playful tone. End some replies with 'Hoot hoot!' "
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
        raise HTTPException(500, f"Azaadi is sleepy: {e}")

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
