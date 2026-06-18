// Local-first API shim — Azaadi Tales.
//
// We keep the OLD shape `API.get(path)` / `API.post(path, body)` so screens
// don't need a rewrite. Each request is routed in-process to a local handler
// backed by AsyncStorage + bundled JSON data. The ONLY request that still
// hits the network is `POST /chat` (Veer AI).
//
// There are NO accounts, tokens or passwords anywhere in this file.

import axios from "axios";
import {
  STORIES,
  BADGES,
  LEVELS,
  HERO_VISUALS,
  FREEDOM_MAP,
  BATTLE_CRIES,
  HUNTS,
  PORTRAITS,
  storyById,
  quizFor,
} from "./data";
import {
  Local,
  getProfile,
  setProfile,
  getProgress,
  levelFromXP,
  badgeDef,
  Profile,
} from "./data/localStore";

// ---------- Network backend (only for Veer chat) ----------
const FALLBACK_BASE = "https://azaadi-stories.preview.emergentagent.com";
const RAW_BASE = process.env.EXPO_PUBLIC_BACKEND_URL;
export const BASE_URL: string =
  RAW_BASE && /^https?:\/\//i.test(RAW_BASE) ? RAW_BASE : FALLBACK_BASE;
// eslint-disable-next-line no-console
console.log("[Azaadi] Local-first mode. Online features hit:", BASE_URL);

const remote = axios.create({ baseURL: `${BASE_URL}/api`, timeout: 30000 });

// ---------- Helper: build the "/me" response shape that screens expect ----------
async function buildMe() {
  const profile = await getProfile();
  const progress = await getProgress();
  const level = levelFromXP(progress.xp);
  if (!profile) {
    return {
      uid: "local",
      username: "guest",
      role: "kid",
      age: 8,
      avatar: "bhagat-singh",
      language: "en",
      xp: 0,
      level: level.level,
      level_name: level.name,
      badges: [],
      completed_stories: [],
      quizzes_taken: {},
      discovered_heroes: [],
      battle_cries_done: [],
      jigsaw_done: [],
      streak: 0,
      daily_goal: 1,
    };
  }
  return {
    uid: "local",
    username: profile.name,
    name: profile.name,
    role: "kid",
    age: 8,
    avatar: profile.avatar || "bhagat-singh",
    language: profile.language,
    xp: progress.xp,
    level: level.level,
    level_name: level.name,
    badges: progress.badges,
    completed_stories: progress.completed_stories,
    quizzes_taken: Object.keys(progress.quizzes_taken).length,
    quizzes_detail: progress.quizzes_taken,
    discovered_heroes: progress.discovered_heroes,
    battle_cries_done: progress.battle_cries_done,
    jigsaw_done: progress.jigsaw_done,
    streak: progress.streak,
    daily_goal: progress.daily_goal,
  };
}

// Return story list metadata (no full content for performance).
function listStories() {
  return STORIES.map((s) => ({
    id: s.id,
    name: s.name,
    era: s.era,
    title_en: s.title_en,
    title_hi: s.title_hi,
    tagline_en: s.tagline_en,
    tagline_hi: s.tagline_hi,
    theme: s.theme,
    color: s.color || HERO_VISUALS[s.id]?.color,
    region: s.region,
    year: s.year,
    portrait_uri: undefined, // screens use the static PORTRAITS map directly
  }));
}

// ---------- Local route handler ----------
async function handle(method: string, path: string, body?: any): Promise<any> {
  // Normalise: strip query, leading /api if any
  const url = path.replace(/^\/?api/, "");
  const [pathOnly] = url.split("?");

  // ----- ME -----
  if (pathOnly === "/me") return await buildMe();

  // ----- AUTH (no-ops — kept for any legacy callsite) -----
  if (pathOnly.startsWith("/auth/")) {
    // Profile must be created via name entry screen, not via API.
    return { ok: true };
  }

  // ----- STORIES -----
  if (pathOnly === "/stories") {
    return listStories();
  }
  const storyMatch = pathOnly.match(/^\/stories\/([^/]+)$/);
  if (storyMatch) {
    const s = storyById(storyMatch[1]);
    if (!s) throw apiError(404, "Story not found");
    return s;
  }
  const quizAlt = pathOnly.match(/^\/stories\/([^/]+)\/quiz$/);
  if (quizAlt && method === "GET") {
    return { story_id: quizAlt[1], questions: quizFor(quizAlt[1]) };
  }
  const completeMatch = pathOnly.match(/^\/stories\/([^/]+)\/complete$/);
  if (completeMatch && method === "POST") {
    const next = await Local.completeStory(completeMatch[1], 20);
    return { ok: true, xp: next.xp, badges: next.badges };
  }
  const portraitMatch = pathOnly.match(/^\/stories\/([^/]+)\/portrait$/);
  if (portraitMatch) {
    // Screens should use PORTRAITS map directly via Image source={PORTRAITS[id]}.
    // We return a sentinel so callers know it's local.
    return { local: true, id: portraitMatch[1] };
  }

  // ----- QUIZZES -----
  const quizGet = pathOnly.match(/^\/quizzes\/([^/]+)$/);
  if (quizGet && method === "GET") {
    return { story_id: quizGet[1], questions: quizFor(quizGet[1]) };
  }
  const quizSub = pathOnly.match(/^\/quizzes\/([^/]+)\/submit$/);
  if (quizSub && method === "POST") {
    const sid = quizSub[1];
    const questions = quizFor(sid);
    const answers: number[] = body?.answers || [];
    let score = 0;
    questions.forEach((q: any, i: number) => {
      if (Number(answers[i]) === Number(q.answer)) score += 1;
    });
    const updated = await Local.saveQuiz(sid, score, questions.length);
    return {
      score,
      total: questions.length,
      xp_earned: score * 5,
      xp_total: updated.xp,
      perfect: score === questions.length,
    };
  }

  // ----- BADGES -----
  if (pathOnly === "/badges") {
    const progress = await getProgress();
    return BADGES.map((b: any) => ({
      ...b,
      earned: progress.badges.includes(b.id),
    }));
  }

  // ----- BATTLE CRIES -----
  if (pathOnly === "/battle-cries") {
    const progress = await getProgress();
    const list = Object.entries(BATTLE_CRIES).map(([hero_id, data]) => ({
      hero_id,
      ...(data as any),
      completed: progress.battle_cries_done.includes(hero_id),
    }));
    return {
      cries: list,
      completed_count: progress.battle_cries_done.length,
      threshold: 5,
      freedom_voice_unlocked: progress.badges.includes("freedom_voice"),
    };
  }
  const bcGet = pathOnly.match(/^\/battle-cries\/([^/]+)$/);
  if (bcGet && method === "GET") {
    const hero_id = bcGet[1];
    const data = (BATTLE_CRIES as any)[hero_id];
    if (!data) throw apiError(404, "Battle cry not found");
    const progress = await getProgress();
    const s = storyById(hero_id);
    return {
      hero_id,
      hero_name: s?.title_en || hero_id,
      hero_color: HERO_VISUALS[hero_id]?.color || "#FF6B35",
      portrait_url: undefined, // screens use PORTRAITS map
      ...data,
      completed: progress.battle_cries_done.includes(hero_id),
      badge_id: `cry_${hero_id}`,
    };
  }
  const bcComp = pathOnly.match(/^\/battle-cries\/([^/]+)\/complete$/);
  if (bcComp && method === "POST") {
    const heroId = bcComp[1];
    const next = await Local.completeBattleCry(heroId, 10);
    return {
      ok: true,
      xp: next.xp,
      badge_id: `cry_${heroId}`,
      freedom_voice_unlocked: next.badges.includes("freedom_voice"),
    };
  }

  // ----- FREEDOM MAP -----
  if (pathOnly === "/freedom-map") {
    const progress = await getProgress();
    return {
      viewBox: FREEDOM_MAP.viewBox,
      fighters: FREEDOM_MAP.fighters.map((f: any) => ({
        ...f,
        discovered: progress.discovered_heroes.includes(f.id),
      })),
      total: FREEDOM_MAP.fighters.length,
      discovered_count: progress.discovered_heroes.length,
      explorer_unlocked: progress.badges.includes("map_explorer"),
    };
  }
  const fmDisc = pathOnly.match(/^\/freedom-map\/discover\/([^/]+)$/);
  if (fmDisc && method === "POST") {
    const heroId = fmDisc[1];
    const next = await Local.discoverHero(heroId, 5);
    // Award explorer badge after all heroes discovered
    if (next.discovered_heroes.length >= FREEDOM_MAP.fighters.length) {
      await Local.addBadge("map_explorer");
    }
    return { ok: true, xp: next.xp, discovered_count: next.discovered_heroes.length };
  }

  // ----- HUNTS -----
  if (pathOnly === "/hunts") {
    return { hunts: HUNTS };
  }
  const huntGet = pathOnly.match(/^\/hunts\/([^/]+)$/);
  if (huntGet && method === "GET") {
    const h = HUNTS.find((x: any) => x.id === huntGet[1]);
    if (!h) throw apiError(404, "Hunt not found");
    return h;
  }
  const huntAns = pathOnly.match(/^\/hunts\/([^/]+)\/answer$/);
  if (huntAns && method === "POST") {
    const h = HUNTS.find((x: any) => x.id === huntAns[1]);
    if (!h) throw apiError(404, "Hunt not found");
    const step = Number(body?.step ?? 0);
    const ans = String(body?.answer || "").trim().toLowerCase();
    const correct = (h.steps?.[step]?.answers || []).some((a: string) => a.toLowerCase() === ans);
    if (correct) await Local.addXP(5);
    return { correct };
  }

  // ----- JIGSAW (list + detail) -----
  const JIGSAW_HEROES = [
    "sarojini-naidu",
    "bhimrao-ambedkar",
    "mahatma-gandhi",
    "tilak",
    "sardar-patel",
  ];
  if (pathOnly === "/jigsaw" && method === "GET") {
    const progress = await getProgress();
    return JIGSAW_HEROES.map((sid) => {
      const s = storyById(sid);
      return {
        id: sid,
        name: s?.name || s?.title_en,
        title_en: s?.title_en,
        title_hi: s?.title_hi,
        color: s?.color || HERO_VISUALS[sid]?.color || "#FF6B35",
        era: s?.era,
        grid: 3,
        xp_reward: 30,
        portrait_url: null, // screens use PORTRAITS map
        solved: progress.jigsaw_done.includes(sid),
      };
    });
  }
  const jig = pathOnly.match(/^\/jigsaw\/([^/]+)\/complete$/);
  if (jig && method === "POST") {
    const sid = jig[1];
    const next = await Local.completeJigsaw(sid, 30);
    // Award jigsaw_master badge if all done
    if (JIGSAW_HEROES.every((h) => next.jigsaw_done.includes(h))) {
      await Local.addBadge("jigsaw_master");
    }
    return { ok: true, xp: next.xp, xp_awarded: 30, just_solved: true };
  }

  // ----- JOURNAL (local-only, NO moderation) -----
  if (pathOnly === "/journal/mine" || pathOnly === "/journal/feed") {
    const progress = await getProgress();
    return {
      posts: progress.journal.map((j) => ({
        id: j.id,
        text: j.text,
        story_id: j.story_id,
        status: "approved",
        created_at: j.created_at,
        author_name: "You",
      })),
    };
  }
  if (pathOnly === "/journal" && method === "POST") {
    const text = String(body?.text || "").trim();
    if (!text) throw apiError(400, "Empty entry");
    await Local.addJournalEntry(text, body?.story_id);
    return { ok: true, status: "approved" };
  }
  const jourDel = pathOnly.match(/^\/journal\/([^/]+)$/);
  if (jourDel && method === "DELETE") {
    await Local.removeJournalEntry(jourDel[1]);
    return { ok: true };
  }

  // ----- CHAT (Veer AI — ONLINE) -----
  if (pathOnly === "/chat" && method === "POST") {
    // Anonymous chat: backend does not require auth for /chat.
    const r = await remote.post("/chat", body);
    return r.data;
  }

  // ----- Profile update -----
  if (pathOnly === "/profile" && method === "PATCH") {
    const profile = await getProfile();
    if (!profile) throw apiError(404, "No profile yet");
    const next: Profile = { ...profile, ...(body || {}) };
    await setProfile(next);
    return await buildMe();
  }

  // ----- Unhandled -----
  // Soft-fail: return null instead of throwing so screens don't crash
  // eslint-disable-next-line no-console
  console.warn("[Local API] no handler for", method, pathOnly);
  return null;
}

function apiError(status: number, detail: string) {
  const err: any = new Error(detail);
  err.response = { status, data: { detail } };
  return err;
}

// ---------- Public API surface ----------
async function wrap<T>(method: string, path: string, body?: any) {
  const data = await handle(method, path, body);
  return { data } as { data: T };
}

export const API = {
  get: <T = any>(path: string) => wrap<T>("GET", path),
  post: <T = any>(path: string, body?: any) => wrap<T>("POST", path, body),
  put: <T = any>(path: string, body?: any) => wrap<T>("PUT", path, body),
  patch: <T = any>(path: string, body?: any) => wrap<T>("PATCH", path, body),
  delete: <T = any>(path: string) => wrap<T>("DELETE", path),
  // Header setter is a no-op now (no auth).
  defaults: { headers: { common: {} as Record<string, string> } },
  interceptors: { request: { use: (_: any) => 0 } },
};

// ---------- Legacy helpers (no-ops now, kept for compatibility) ----------
export const saveAuth = async () => {};
export const clearAuth = async () => {};
export const getStoredToken = async () => null;
export const getStoredUser = async () => {
  const profile = await getProfile();
  if (!profile) return null;
  const me = await buildMe();
  return me;
};

export const describeApiError = (err: any): string => {
  if (!err) return "Unknown error";
  if (err.response?.data?.detail) return err.response.data.detail;
  return err.message || "Something went wrong";
};

// Re-export commonly-used local helpers so screens can import from one place.
export { Local, getProfile, setProfile, getProgress, levelFromXP, badgeDef, PORTRAITS };
