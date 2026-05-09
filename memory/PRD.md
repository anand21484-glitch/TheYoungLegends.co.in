# Azaadi Tales — Product Requirements (MVP)

## Vision
An AI-powered Expo mobile app (kids 5-14) that brings India's freedom fighters to life through illustrated short stories, an AI owl companion "Azaadi", quizzes, and gamification. Bilingual (English + Hindi).

## MVP Scope (delivered)
1. **Auth** — Simple username/password signup & login (bcrypt + JWT 30-day token), age + avatar + language picker.
2. **Story Library** — 8 freedom fighter stories curated (Bhagat Singh, Rani Lakshmibai, Mahatma Gandhi, Subhas Chandra Bose, Sarojini Naidu, Chandrashekhar Azad, Mangal Pandey, Dr. B. R. Ambedkar). Each story has full English + Hindi versions, age-appropriate language, and 5 quiz questions.
3. **Story Reader** — Full story view with EN/HI toggle, on-device TTS narration via `expo-speech` (English + Hindi voices), "I Finished Reading" CTA → +20 XP, then Quiz CTA.
4. **Quiz Engine** — 5 multiple-choice questions per story, progress bar, instant feedback, scoring (5 XP/correct + 15 XP perfect bonus), result celebration screen.
5. **Azaadi AI Chat** — Conversational owl mascot powered by **Claude Sonnet 4.5** (via Emergent Universal Key), kid-safe system prompt, Hindi/English replies, persistent chat history, suggested prompts.
6. **Gamification** — XP system, 6 levels (Young Patriot → Freedom Champion), 7 badges (First Step, Story Explorer, Freedom Champion, Truth Seeker, Quiz Master, Brave Heart, Wise Companion), daily streak.
7. **Profile** — Avatar hero card, level/XP, streak, badge grid (earned + locked), logout.

## Tech Stack
- **Frontend**: Expo SDK 54, expo-router (file-based), TypeScript, expo-speech, AsyncStorage, axios, lucide/Ionicons
- **Backend**: FastAPI, Motor (async MongoDB), bcrypt, PyJWT, emergentintegrations (Claude Sonnet 4.5)
- **DB**: MongoDB (`azaadi_tales` db) — collections: `users`, `chat_messages`
- **AI**: Claude Sonnet 4.5 via EMERGENT_LLM_KEY (universal key)

## Key API Endpoints (`/api/...`)
- `POST /auth/signup` `{username, password, age, avatar, language}` → `{token, user}`
- `POST /auth/login` `{username, password}` → `{token, user}`
- `GET /me` → user profile (auto-updates streak)
- `GET /stories` → list, `GET /stories/{id}` → detail (EN+HI), `GET /stories/{id}/quiz` → questions
- `POST /stories/complete` `{story_id}` → +20 XP, badge updates
- `POST /quiz/submit` `{story_id, answers[]}` → score + correct answers + XP
- `POST /chat` `{message, language}` → Azaadi reply (Claude Sonnet 4.5)
- `GET /chat/history`, `GET /badges`, `GET /levels`

## Future Roadmap
- OpenAI Whisper voice questions to Azaadi
- Parent dashboard, more languages, community journal, AR, treasure hunts
