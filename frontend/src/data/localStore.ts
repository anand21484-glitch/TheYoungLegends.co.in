// localStore — Offline-first progress store.
// All progress (name, XP, badges, completed stories, etc.) lives in AsyncStorage.
// There is NO backend account, NO password, NO token. One profile per device.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LEVELS, BADGES } from "./index";

// ---------- Types ----------
export type Profile = {
  name: string;
  avatar?: string;       // hero id, e.g. "bhagat-singh"
  language: "en" | "hi";
  createdAt: string;
};

export type Progress = {
  xp: number;
  badges: string[];               // badge ids
  completed_stories: string[];    // story ids fully read
  quizzes_taken: Record<string, { score: number; total: number; at: string }>;
  discovered_heroes: string[];    // freedom-map nodes tapped
  battle_cries_done: string[];    // battle-cry hero ids completed
  jigsaw_done: string[];          // story ids whose jigsaw was solved
  hero_experts: string[];         // hero ids where all 4 ask-the-hero Qs answered
  asked: Record<string, string[]>; // hero_id → array of answered question ids
  journal: JournalEntry[];        // local-only journal
  streak: number;                 // consecutive days opened
  last_open: string;              // ISO date of last app open
  daily_goal: number;             // stories per day goal
};

export type JournalEntry = {
  id: string;
  text: string;
  story_id?: string;
  created_at: string;
};

// ---------- Defaults ----------
const DEFAULT_PROGRESS: Progress = {
  xp: 0,
  badges: [],
  completed_stories: [],
  quizzes_taken: {},
  discovered_heroes: [],
  battle_cries_done: [],
  jigsaw_done: [],
  hero_experts: [],
  asked: {},
  journal: [],
  streak: 0,
  last_open: "",
  daily_goal: 1,
};

// ---------- Keys ----------
const K_PROFILE = "azaadi.profile";
const K_PROGRESS = "azaadi.progress";

// ---------- Profile ----------
export async function getProfile(): Promise<Profile | null> {
  const raw = await AsyncStorage.getItem(K_PROFILE);
  return raw ? JSON.parse(raw) : null;
}

export async function setProfile(p: Profile) {
  await AsyncStorage.setItem(K_PROFILE, JSON.stringify(p));
}

export async function hasProfile(): Promise<boolean> {
  return !!(await getProfile());
}

// ---------- Progress ----------
export async function getProgress(): Promise<Progress> {
  const raw = await AsyncStorage.getItem(K_PROGRESS);
  if (!raw) return { ...DEFAULT_PROGRESS };
  try {
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export async function setProgress(p: Progress) {
  await AsyncStorage.setItem(K_PROGRESS, JSON.stringify(p));
}

async function patch(fn: (p: Progress) => Progress) {
  const cur = await getProgress();
  const next = fn(cur);
  await setProgress(next);
  return next;
}

// ---------- Mutations ----------
export const Local = {
  // Award XP — returns the new totals + level + any new level emoji
  async addXP(amount: number) {
    return patch((p) => ({ ...p, xp: p.xp + amount }));
  },

  async addBadge(badgeId: string) {
    return patch((p) =>
      p.badges.includes(badgeId)
        ? p
        : { ...p, badges: [...p.badges, badgeId] },
    );
  },

  async completeStory(storyId: string, xpAward = 20) {
    return patch((p) => {
      if (p.completed_stories.includes(storyId)) return p;
      return {
        ...p,
        completed_stories: [...p.completed_stories, storyId],
        xp: p.xp + xpAward,
      };
    });
  },

  async saveQuiz(storyId: string, score: number, total: number) {
    return patch((p) => ({
      ...p,
      quizzes_taken: {
        ...p.quizzes_taken,
        [storyId]: { score, total, at: new Date().toISOString() },
      },
      xp: p.xp + score * 5,
    }));
  },

  async discoverHero(heroId: string, xpAward = 5) {
    return patch((p) => {
      if (p.discovered_heroes.includes(heroId)) return p;
      return {
        ...p,
        discovered_heroes: [...p.discovered_heroes, heroId],
        xp: p.xp + xpAward,
      };
    });
  },

  async completeBattleCry(heroId: string, xpAward = 10) {
    return patch((p) => {
      if (p.battle_cries_done.includes(heroId)) return p;
      const next = {
        ...p,
        battle_cries_done: [...p.battle_cries_done, heroId],
        xp: p.xp + xpAward,
        badges: p.badges.includes(`cry_${heroId}`)
          ? p.badges
          : [...p.badges, `cry_${heroId}`],
      };
      // Freedom Voice badge after 5 cries
      if (next.battle_cries_done.length >= 5 && !next.badges.includes("freedom_voice")) {
        next.badges = [...next.badges, "freedom_voice"];
      }
      return next;
    });
  },

  async completeJigsaw(storyId: string, xpAward = 15) {
    return patch((p) => {
      if (p.jigsaw_done.includes(storyId)) return p;
      return {
        ...p,
        jigsaw_done: [...p.jigsaw_done, storyId],
        xp: p.xp + xpAward,
      };
    });
  },

  // ----- Ask the Hero -----
  // Mark a single question as asked for a given hero. Returns whether the
  // hero is now an "Expert" (all 4 questions answered for the first time).
  async markAsked(heroId: string, questionId: string) {
    let becameExpert = false;
    const next = await patch((p) => {
      const already = (p.asked[heroId] || []).includes(questionId);
      if (already) return p;
      const updatedAsked = {
        ...p.asked,
        [heroId]: [...(p.asked[heroId] || []), questionId],
      };
      const totalForHero = updatedAsked[heroId].length;
      let hero_experts = p.asked[heroId]?.length === 4 ? p.hero_experts : p.hero_experts;
      const isFirstExpert = totalForHero >= 4 && !p.hero_experts.includes(heroId);
      if (isFirstExpert) {
        becameExpert = true;
        hero_experts = [...p.hero_experts, heroId];
      }
      // +2 XP per new question answered
      return { ...p, asked: updatedAsked, hero_experts, xp: p.xp + 2 };
    });
    return { progress: next, becameExpert };
  },

  async addJournalEntry(text: string, storyId?: string) {
    const entry: JournalEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      text: text.trim(),
      story_id: storyId,
      created_at: new Date().toISOString(),
    };
    return patch((p) => ({ ...p, journal: [entry, ...p.journal] }));
  },

  async removeJournalEntry(id: string) {
    return patch((p) => ({ ...p, journal: p.journal.filter((e) => e.id !== id) }));
  },

  async touchDailyStreak() {
    return patch((p) => {
      const today = new Date().toISOString().slice(0, 10);
      if (p.last_open === today) return p;
      const yesterday = (() => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().slice(0, 10);
      })();
      const newStreak = p.last_open === yesterday ? p.streak + 1 : 1;
      return { ...p, last_open: today, streak: newStreak };
    });
  },

  async reset() {
    await AsyncStorage.multiRemove([K_PROFILE, K_PROGRESS]);
  },
};

// ---------- Helpers ----------
export function levelFromXP(xp: number) {
  let current: any = LEVELS[0] || { level: 1, name: "Young Patriot", min_xp: 0 };
  for (const lvl of LEVELS) {
    const need = (lvl as any).min_xp ?? (lvl as any).xp_required ?? (lvl as any).xp ?? 0;
    if (xp >= need) current = lvl;
  }
  return current;
}

export function badgeDef(id: string) {
  return BADGES.find((b) => b.id === id);
}
