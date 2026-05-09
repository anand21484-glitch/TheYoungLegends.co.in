# Azaadi Tales — Product Requirements

## Vision
An AI-powered Expo mobile app (kids 5-14) bringing India's freedom fighters to life through illustrated stories, an AI owl companion, gamification, and a safe community journal — with full parental oversight.

## Phase 1 (MVP) — Delivered
1. **Auth** — Username/password signup & login (bcrypt + JWT 30-day)
2. **8 Stories** (Bhagat Singh, Rani Lakshmibai, Gandhi, Bose, Sarojini Naidu, Chandrashekhar Azad, Mangal Pandey, Ambedkar) — 450-600 words each (3+ min TTS), bilingual EN+HI, with 4 actionable lessons per story
3. **Story Reader** — EN/HI toggle, on-device TTS narration (story + lessons separately), inline + post-finish "What I Learned" cards
4. **Quiz Engine** — 5 MCQs/story, instant scoring, perfect-quiz bonus
5. **Azaadi AI Chat** — Claude Sonnet 4.5 owl companion, kid-safe, bilingual
6. **Gamification** — 6 levels, 7 badges, XP, daily streaks
7. **Profile** — avatar hero, level, badges grid, stats

## Phase 2 — Delivered ✅
### Parent Dashboard (`/parent`)
- Parent role at signup (own account, no age/avatar)
- Auto-redirect after login: parents → `/parent`, kids → `/(tabs)`
- Link a child by username (one-time bind)
- View each child's full progress (XP, level, stories read, quizzes, badges, streak)
- Set daily story goals per child (1, 2, 3, or 5 stories)
- Review queue for pending journal posts (approve/reject)

### Community Freedom Journal
- New "Journal" tab (5th kid tab) with Community feed + My Posts toggle
- "Write Reflection" screen with prompts, optional story tag, 5-800 char limit
- **AI safety moderation** via Claude Sonnet 4.5 — rejects posts with PII (phone/address/school), violence, hate, profanity
- **Parental approval flow** — if kid is linked to a parent, post → `pending` until parent approves; otherwise auto-approved after AI check
- Three positive reactions: 🔥 Brave! 💡 Inspiring! 🌟 Amazing! — toggleable, counts shown
- Post status visible to author (pending/approved/rejected)

## Tech Stack
- **Frontend**: Expo SDK 54, expo-router, TypeScript, expo-speech (TTS), AsyncStorage, axios, Ionicons
- **Backend**: FastAPI + Motor (async MongoDB), bcrypt, PyJWT, emergentintegrations (Claude Sonnet 4.5 for chat + moderation)
- **DB**: MongoDB collections — `users`, `chat_messages`, `journal`
- **AI**: Claude Sonnet 4.5 via `EMERGENT_LLM_KEY`

## Key API Endpoints
**Auth**: `POST /api/auth/signup` (with `role`), `POST /api/auth/login`, `GET /api/me`
**Stories**: `GET /api/stories`, `GET /api/stories/{id}` (returns lessons), `GET /api/stories/{id}/quiz`, `POST /api/stories/complete`, `POST /api/quiz/submit`
**Azaadi**: `POST /api/chat`, `GET /api/chat/history`
**Parent**: `GET /api/parent/children`, `POST /api/parent/link-child`, `POST /api/parent/child/{id}/goal`, `GET /api/parent/child/{id}/progress`, `GET /api/parent/pending-posts`, `POST /api/parent/posts/{id}/moderate`
**Journal**: `POST /api/journal`, `GET /api/journal/feed`, `GET /api/journal/mine`, `POST /api/journal/{id}/react`
**Misc**: `GET /api/badges`, `GET /api/levels`

## Validation
- Phase 1: 15/15 backend tests + e2e frontend ✅
- Phase 2: 32/32 backend tests (17 new Phase-2 + 15 Phase-1 regression) + e2e frontend ✅

## Future Roadmap
- Treasure Hunts (multi-step cross-story clues)
- OpenAI Whisper voice questions to Azaadi
- Avatar customization shop
- More languages (Tamil, Bengali, Marathi)
- 22 regional heroes (30-story catalog)
