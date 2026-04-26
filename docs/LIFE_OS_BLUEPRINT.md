# Life OS Blueprint

This blueprint defines the intended one-person product architecture for JARVIS as a full Life OS.

## Design Principles
- Action over noise: every module should produce a concrete next step.
- Identity-based reinforcement: behavior should reflect "who I am becoming."
- Calm, premium clarity: no noisy gamification or visual clutter.
- First-principles execution: simplify to essentials, then compound results.

## Core Modules

### 0) Today Command Center
- Purpose: deliver one stable daily operating brief so the day starts with clear direction.
- Key outputs:
  - mission focus
  - .NET/full-stack learning topic
  - English word + confidence drill
  - wealth focus
  - health/diet/physical action
  - quote/story + reflection/blog prompts
- Backend API:
  - `GET /api/daily-guide/today`
- Selection model:
  - deterministic by date
  - local curated seed content first (no external API dependency)
- UX behavior:
  - calm, premium layout
  - no noisy random refresh changes

### 1) Finance & Money Discipline
- Purpose: turn daily spending into controlled decision-making.
- Key screens: daily expense log, budget status, weekly money review, savings tracker.
- Core entities: `Expense`, `BudgetProfile`, `SavingsGoal`, `MoneyInsight`.
- Backend APIs:
  - `GET /api/expenses/today`
  - `POST /api/expenses`
  - `DELETE /api/expenses/{id}`
  - `GET /api/insights/today` (finance insight summary)
- Frontend components: `FinanceLab`, `WeeklyReview`, `MoneyInsightCard` (future).
- Behavioral UX:
  - immediate "logged" acknowledgement
  - plain-English budget status
  - small over-limit intervention prompts

### 1.1) Wealth Builder (Income-First Layer)
- Purpose: increase earning capacity and income consistency before expense guilt loops.
- Core entities: `IncomeLog`.
- Backend APIs:
  - `POST /api/income`
  - `GET /api/income/recent`
  - `GET /api/income/month-summary`
- UX behavior:
  - monthly income goal progress
  - savings goal visibility
  - skill-to-income action prompts
  - expense section kept secondary

### 2) Learning (.NET + Engineering)
- Purpose: convert learning intent into shipped output.
- Key screens: today topic, roadmap categories, progress controls, learning logs.
- Core entities: `LearningLog`, `LearningTopicProgress`.
- Backend APIs:
  - `GET /api/learning/today`
  - `GET /api/learning/roadmap`
  - `POST /api/learning/log`
  - `PATCH /api/learning/topic-progress`
- Frontend components: `LearningLab` (roadmap-driven).
- Behavioral UX:
  - completion framing around "output shipped"
  - progress over perfection cues
  - weekly reflection on what was built

### 3) English & Communication
- Purpose: build practical communication confidence through repetitions.
- Key screens: daily vocab, speaking drills, conversation scenarios, workplace/interview practice.
- Core entities: `CommunicationLog`, optional `VocabularyEntry` store.
- Backend APIs:
  - `GET /api/communication/today`
  - `GET /api/communication/recent`
  - `POST /api/communication/log`
- Frontend components: `CommunicationLab` + existing training modules.
- Behavioral UX:
  - short, low-friction speaking tasks
  - session continuity: "last drill completed"
  - confidence prompts tuned to current state

### 3.1) Diary + Blog System
- Purpose: strengthen self-reflection, clarity, and communication output quality.
- Core entities: `DiaryEntry`, `BlogDraft`.
- Backend APIs:
  - `POST /api/diary`
  - `GET /api/diary/recent`
  - `POST /api/blog-drafts`
  - `GET /api/blog-drafts/recent`
  - `PATCH /api/blog-drafts/{id}`
- UX behavior:
  - private reflection first
  - convert reflection into publishable communication reps
  - maintain recent writing history for continuity

### 4) Health, Sleep, Hydration, Energy
- Purpose: stabilize body systems to sustain deep work.
- Key screens: hydration tracker, sleep quality, workout adherence, recovery check.
- Core entities: `HydrationLog`, `SleepLog`, `WorkoutLog`, `EnergyCheck`.
- Backend APIs (planned):
  - `GET /api/health/today`
  - `POST /api/health/hydration`
  - `POST /api/health/sleep`
- Frontend components: existing health modules + shared trend cards.
- Behavioral UX:
  - body-system framing (not vanity metrics)
  - minimum viable health actions
  - evening close-loop reminders

### 5) Emotional Intelligence & Self-Awareness
- Purpose: make mood-aware execution decisions.
- Key screens: mood check-in, emotional pattern notes, regulation micro-protocols.
- Core entities: `MoodLog`, `RegulationProtocol`, `ReflectionNote`.
- Backend APIs (planned):
  - `POST /api/emotion/log`
  - `GET /api/emotion/patterns`
- Frontend components: existing `MoodCheckIn` + `EmotionalStability` expansion.
- Behavioral UX:
  - normalize state without judgment
  - suggest smallest stabilizing action
  - avoid over-analysis loops

### 6) Focus, Distraction, Discipline
- Purpose: protect attention and execution blocks.
- Key screens: focus timer, distraction triggers, mission prioritization.
- Core entities: `FocusSession`, `DistractionEvent`, `DisciplineProtocol`.
- Backend APIs (planned):
  - `POST /api/focus/sessions`
  - `GET /api/focus/summary/today`
- Frontend components: `FocusTimer`, `DopamineControl`, `BattlePlan`.
- Behavioral UX:
  - immediate focus completion capture
  - friction-reduced restart flows
  - streak reinforcement delayed (not spammy)

### 7) Confidence & Identity
- Purpose: shift self-image through repeated evidence.
- Key screens: identity signals, confidence drills, progress evidence feed.
- Core entities: `IdentitySignal`, `ConfidenceRep`, `ProofLog`.
- Backend APIs (planned):
  - `GET /api/identity/signals`
  - `POST /api/identity/proofs`
- Frontend components: `IdentityUpgrade`, `Achievements` enhancement.
- Behavioral UX:
  - language anchored in evidence
  - "proof over hype" reinforcement

### 8) Goals, Missions, Weekly/Monthly Review
- Purpose: align daily execution to long-term mission.
- Key screens: mission queue, weekly review, monthly system audit.
- Core entities: `Mission`, `MissionTemplate`, `WeeklyReviewSnapshot`, `MonthlyReviewSnapshot`.
- Backend APIs:
  - current missions/stats/history endpoints
  - monthly analytics endpoints (planned)
- Frontend components: `Missions`, `WeeklyReview`, `MissionHistory`.
- Behavioral UX:
  - one clear next action
  - trend awareness without overload
  - reflective closure loops

### 9) Jarvis Assistant / Coach
- Purpose: provide context-aware guidance with calm intelligence.
- Key screens: assistant panel with quick prompts and continuity context.
- Core entities: `AssistantInteraction`, `ContextSnapshot`, `SuggestedAction`.
- Backend APIs (planned for AI integration):
  - `POST /api/assistant/respond`
  - `GET /api/assistant/context`
- Frontend components: `JarvisAssistant`.
- Behavioral UX:
  - references recent actions
  - adapts to momentum level
  - avoids hype and over-messaging
  - uses Today Guide + learning/communication/wealth context for "what next" prompts

## Daily Wisdom Seeds
- Content categories:
  - productivity tip
  - health tip
  - diet tip
  - physical challenge
  - mental model
  - inspirational story
  - engineering principle
  - confidence principle
- Implementation rule:
  - local curated content first
  - deterministic date selection
  - external APIs are future optional enhancement

## Behavioral Reinforcement Strategy
- Immediate acknowledgements:
  - mission complete
  - expense logged
  - checklist updated
- Delayed reinforcement:
  - streak growth and trend quality
- Continuity memory:
  - last completed mission
  - last expense logged
  - session action count

## Implementation Priority (Recommended)
1. Add migrations workflow to replace `EnsureCreated` bootstrap in non-dev paths
2. Add automated API and UI tests around new learning/communication/writing flows
3. Expand assistant logic with deeper per-module history summaries
4. Add monthly review analytics and mission quality scoring
5. Integrate optional external APIs for adaptive content enrichment (quotes/news/market context) with caching and fallback to local seeds
