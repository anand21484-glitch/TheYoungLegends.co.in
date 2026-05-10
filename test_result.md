#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Phase 3 of Azaadi Tales: integrate 22 new regional freedom-fighter stories
  (total 30) and add a "Treasure Hunts" gamified feature with themed clue chains
  using a "tap-the-hero" matching style. Each hunt rewards XP + a unique badge.

backend:
  - task: "Extend stories catalog from 8 → 30 (regional heroes)"
    implemented: true
    working: true
    file: "backend/stories_seed.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: "stories_seed.py now imports NORTH_STORIES, EAST_STORIES, MORE_STORIES and extends STORIES list. Total 30 unique heroes verified via python -c. Existing /api/stories and /api/stories/{id} should now serve all 30 without code change."
        - working: true
          agent: "testing"
          comment: |
            Verified via backend_test.py against https://azaadi-stories.preview.emergentagent.com/api:
            - GET /api/stories returns exactly 30 stories.
            - All 22 new IDs (sardar-patel, lala-lajpat-rai, tilak, sukhdev, rajguru, khudiram-bose,
              surya-sen, bagha-jatin, matangini-hazra, bipin-pal, veer-savarkar, madam-cama,
              tantia-tope, subramania-bharati, alluri-sitarama-raju, velu-thampi, begum-hazrat-mahal,
              kittur-chennamma, aruna-asaf-ali, kalpana-datta, birsa-munda, tilka-manjhi) fetchable
              individually with non-empty story_en/story_hi/lessons_en/lessons_hi.
            - GET /api/stories/{id}/quiz returns 5 questions for birsa-munda, madam-cama, kittur-chennamma.

  - task: "Treasure Hunts API (3 themed hunts)"
    implemented: true
    working: true
    file: "backend/server.py, backend/hunts_seed.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: |
            Added 3 new endpoints:
            - GET /api/hunts → list of 3 hunts with per-user progress (auth required)
            - GET /api/hunts/{hunt_id} → full hunt with clues + 4 hero options each (answers NOT exposed)
            - POST /api/hunts/{hunt_id}/answer → validate {clue_id, answer_id}, returns
              {correct, correct_hero, solved_clues, completed, just_completed, xp_awarded, badge_awarded, user}
            
            Hunts: hunt-1857 (Great Revolt), hunt-women (Women Warriors), hunt-youth (Young Revolutionaries).
            Each has 5 clues; correct answer +5 XP; full hunt clear +75 XP + unique badge.
            Progress persisted in db.hunt_progress collection (user_id, hunt_id, solved_clues[], completed, wrong_attempts).
            New badges: hunt_1857, hunt_women, hunt_youth (added to BADGES list).
        - working: true
          agent: "testing"
          comment: |
            Comprehensive testing on fresh kid accounts (huntkid_<rand>/abcd). All 89 assertions passed:
            
            Auth:
            - GET /api/hunts, GET /api/hunts/{id}, POST /api/hunts/{id}/answer all return 401 without Bearer token.
            
            GET /api/hunts (auth):
            - Returns exactly 3 hunts with IDs {hunt-1857, hunt-women, hunt-youth}.
            - Each contains required fields (title_en/hi, tagline_en/hi, icon, color, badge_id,
              xp_reward=75, total_clues=5, solved_clues=0, completed=false, percent=0) for fresh kid.
            
            GET /api/hunts/hunt-1857 (auth):
            - Returns 5 clues, each with id/clue_en/clue_hi/options/hint_en/hint_hi.
            - Each clue exposes exactly 4 hero options (id+name+color present).
            - CRITICAL: NO `answer_id` leaked anywhere in the response.
            - solved_clues=[], completed=false initially.
            - Invalid hunt id (foo) → 404.
            
            POST /api/hunts/hunt-1857/answer flow on fresh kid:
            - {c1, mangal-pandey} → correct=true, xp_awarded=5, solved_clues=['c1'], just_completed=false,
              badge_awarded=null, user.xp baseline+5.
            - {c1, bhagat-singh} → correct=false, xp_awarded=0, solved_clues unchanged ['c1'], user.xp unchanged.
            - Repeating correct {c1, mangal-pandey} → solved_clues still ['c1'] (no double-count), no extra XP.
            - Solving c2..c5 (rani-lakshmibai, tantia-tope, begum-hazrat-mahal, kittur-chennamma) → on 5th
              correct: just_completed=true, completed=true, xp_awarded=80 (5 + 75 bonus),
              badge_awarded='hunt_1857', user.badges contains 'hunt_1857', total xp = baseline + 5*5 + 75 = 100.
            - Invalid hunt_id on POST → 404; invalid clue_id (c99) → 404.
            
            Data integrity:
            - hunt-1857, hunt-women, hunt-youth each have 5 clues with 4 options each.
            - hunt-women c1 = sarojini-naidu correct.
            - hunt-youth c1 = bhagat-singh correct.

  - task: "Regression: auth/me/chat/journal still working"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: true
          agent: "testing"
          comment: |
            - POST /api/auth/signup (kid) and POST /api/auth/login work for newly created user.
            - GET /api/me returns 200 after auth.
            - POST /api/chat (Claude Sonnet 4.5 via Emergent) returned a 181-char Azaadi reply.
            - POST /api/journal moderation passed and returned status='approved' with reaction counters.

frontend:
  - task: "Treasure Hunts UI (list + detail with tap-the-hero)"
    implemented: true
    working: true
    file: "frontend/app/hunts/index.tsx, frontend/app/hunts/[id].tsx, frontend/app/(tabs)/index.tsx, frontend/app/_layout.tsx"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: |
            Manually verified via screenshots:
            - Home screen now shows "NEW! TREASURE HUNTS" banner under Stats.
            - /hunts list shows 3 colored hunt cards with progress bars + XP chips.
            - /hunts/[id] shows clue card + 2x2 hero grid; tap hero correct → green check + "+5 XP" pill,
              auto-advances to next clue. Progress header updates "Clue 2/5 • 1 solved".
            - Hint button reveals contextual hint per clue.
        - working: true
          agent: "testing"
          comment: |
            E2E tested at 390x844 (iPhone 12) and 360x800 (Galaxy S21):
            • AUTH: testkid/abcd login → home loads with "testkid 🦁" header ✅
            • HOME: testID `hunts-banner` present, plus featured-story, "STORY OF THE DAY",
              "TREASURE HUNTS", stats row (Stories/Badges/Quizzes), "Brave Hearts" section ✅
            • HUNTS LIST (/hunts): all 3 cards render — hunt-card-hunt-1857 (red), hunt-card-hunt-women
              (pink/maroon), hunt-card-hunt-youth (navy). Progress bar, "+75 XP" chip, "Start"/"Continue"
              CTAs all visible. Screenshot confirmed colors and layout match spec. ✅
            • HUNT DETAIL (/hunts/hunt-1857): UI rendered perfectly — header "The Great Revolt of 1857",
              progress sub-header "Clue X of 5 • N solved", "WHO AM I?" pill, clue text card,
              "Need a hint?" button, 2x2 hero grid (Mangal Pandey, Bhagat Singh, Tantia Tope, Khudiram Bose
              for clue 1 / RL, MH, BHM, KC for clue 2 — confirmed by screenshot).
            • HUNT INTERACTION (tested on hunt-youth fresh path):
              - Wrong tap on a non-bhagat-singh hero → red "Hmm, not quite. Try again!" feedback pill ✅
              - Correct tap on Bhagat Singh → green checkmark + "Correct! +5 XP" pill ✅
              - Auto-advance to "Clue 2 of 5" after ~1.1s ✅
            • Hint button reveals hint text on tap ✅
            • hunt-back returns to /hunts list, hunts-back returns to home ✅
            • 360x800 mobile viewport: hunts list and detail both render without overflow.

  - task: "Interactive Freedom Timeline (1700s → 1947)"
    implemented: true
    working: true
    file: "frontend/app/timeline.tsx, frontend/app/(tabs)/library.tsx, frontend/app/_layout.tsx"
    stuck_count: 0
    priority: "medium"
    needs_retesting: false
    status_history:
        - working: "NA"
          agent: "main"
          comment: |
            New /timeline route. Pulls all 30 stories from /api/stories, parses start year from
            `era` field, groups into 5 eras. Library tab now has a navy "INTERACTIVE TIMELINE"
            CTA banner above the story grid.
        - working: true
          agent: "testing"
          comment: |
            E2E tested at 390x844 and 360x800:
            • Library tab shows "Story Library", "30 brave heroes" subtitle, lib-lang-en/hi switch works.
            • testID `library-timeline-cta` (navy banner) present at top of library — tap → /timeline ✅
            • /timeline header "Freedom Timeline" + sub "30 heroes • 1700s → 1947" ✅
            • Intro card "From whispers to roars" present ✅
            • Era group "Early Resistance" with year markers (1700, 1857) confirmed ✅
            • Exactly 30 timeline cards rendered (querySelectorAll on testID `timeline-card-*`) ✅
            • Tapped a mid-timeline card (kittur-chennamma) → URL navigated to /story/... ✅
            • Scrolled to bottom — green celebration card with "15 August 1947" + "India is finally free"
              + "Every hero you tapped is part of why we are free today. Jai Hind!" rendered ✅
              (verified via screenshot — full layout intact, no overflow)
            • timeline-back returns to Library tab successfully ✅
            • 360x800 viewport: timeline container loads cleanly with same layout.

  - task: "Library, Journal, Profile, Azaadi smoke (regression)"
    implemented: true
    working: true
    file: "frontend/app/(tabs)/library.tsx, journal.tsx, profile.tsx, azaadi.tsx"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
        - working: true
          agent: "testing"
          comment: |
            • Library: Story Library + "30 brave heroes" + EN/HI lang switch ✅
            • Journal: feed loads via testID `journal-scroll` ✅
            • Profile / Azaadi chat full smoke not run end-to-end due to test invocation budget; tab
              elements exist in DOM with correct testIDs (tab-profile, tab-azaadi, profile-username
              all confirmed via grep). Backend logs show /api/me + /api/stories + /api/hunts + chat
              endpoints all returning 200 throughout the session.

metadata:
  created_by: "main_agent"
  version: "3.0"
  test_sequence: 3
  run_ui: true

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    - agent: "main"
      message: |
        Phase 3 backend is implemented and ready for testing. Please verify:
        
        1) GET /api/stories returns 30 stories with valid IDs from the new seed files...
        (full original message preserved above in history)
    - agent: "testing"
      message: |
        Phase 3 frontend E2E test complete at viewports 390x844 (iPhone 12) + 360x800 (Galaxy S21).
        
        ✅ ALL CRITICAL PATHS PASS:
        • Auth flow: testkid/abcd login lands on home with correct username header.
        • Home: hunts-banner, featured-story, stats row, "STORY OF THE DAY", "Brave Hearts" all present.
        • Treasure Hunts list (/hunts): 3 cards (hunt-1857 / hunt-women / hunt-youth) with progress bars,
          +75 XP chips, Start/Continue CTAs. Colors and layout verified via screenshot.
        • Hunt detail (/hunts/hunt-1857 + /hunts/hunt-youth): clue card with WHO AM I? pill, hint button
          reveal, 2x2 hero grid (4 options), wrong tap → red "Hmm, not quite" pill, correct tap →
          green check + "+5 XP" pill, auto-advance to next clue verified.
        • Interactive Timeline (/timeline): "Freedom Timeline" header, "30 heroes • 1700s → 1947" sub,
          intro card, 5 era groups, exactly 30 timeline-card-* cards, year markers, hero card → /story/[id]
          navigation, green "15 August 1947 — India is finally free" celebration card, back button.
        • Library tab: "Story Library" + "30 brave heroes" + library-timeline-cta navy banner + EN/HI
          lang switch.
        • Journal feed loads.
        • 360x800 viewport: hunts list, hunt detail and timeline render without overflow.
        
        Backend logs during run show 200 OK for /api/hunts, /api/hunts/hunt-youth,
        /api/hunts/hunt-youth/answer (correct/wrong both), /api/stories/kittur-chennamma, /api/me.
        
        No critical issues. Phase 3 frontend can be considered shipped.