// Bundled data — exported from backend via scripts_export_to_frontend.py.
// All story/quiz/badge/map/battle-cry content lives entirely on-device.
//
// To regenerate after editing backend seeds:
//   $ python3 /app/backend/scripts_export_to_frontend.py

// eslint-disable-next-line @typescript-eslint/no-var-requires
const storiesData: any[] = require("./stories.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const badgesData: { badges: any[]; levels: any[] } = require("./badges.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const heroVisualsData: Record<string, any> = require("./hero_visuals.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const freedomMapData: { viewBox: { w: number; h: number }; fighters: any[] } =
  require("./freedom_map.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const battleCriesData: Record<string, any> = require("./battle_cries.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const huntsData: any[] = require("./hunts.json");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const heroQAData: Record<string, { name: string; questions: any[] }> =
  require("../../assets/data/heroes_qa_combined.json");

export const STORIES: any[] = storiesData;
export const BADGES: any[] = badgesData.badges || [];
export const LEVELS: any[] = badgesData.levels || [];
export const HERO_VISUALS: Record<string, any> = heroVisualsData;
export const FREEDOM_MAP: { viewBox: { w: number; h: number }; fighters: any[] } =
  freedomMapData;
export const BATTLE_CRIES: Record<string, any> = battleCriesData;
export const HUNTS: any[] = huntsData;
export const HERO_QA: Record<string, { name: string; questions: any[] }> = heroQAData;

// ---------- Portrait map ----------
// Statically `require()` every portrait so Metro bundles them.
// (Dynamic require with a variable doesn't work in React Native.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PORTRAITS: Record<string, any> = (() => {
  // We map only those story IDs that exist. Unknown IDs return undefined → caller falls back.
  // Using a require.context-like pattern isn't supported by Metro, so we enumerate.
  // The list mirrors the files exported into /app/frontend/assets/portraits/.
  const m: Record<string, any> = {};
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const list = require("./portrait_map").default;
    Object.assign(m, list);
  } catch {
    // portrait_map.ts may not yet exist on first import; harmless
  }
  return m;
})();

export function storyById(id: string) {
  return STORIES.find((s) => s.id === id);
}

export function heroColor(storyId: string): string {
  return heroVisualsData[storyId]?.color || "#FF6B35";
}

export function quizFor(storyId: string): any[] {
  const s = storyById(storyId);
  return (s?.quiz as any[]) || [];
}
