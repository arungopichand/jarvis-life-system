# JARVIS Life System

JARVIS Life System is a personal Life OS built with **.NET 10 + Angular 20**.  
It combines execution discipline, financial awareness, skill growth, communication practice, and reflective review into one focused system.

This repository is designed for two goals:
- daily personal use
- GitHub-showcase quality as a serious full-stack engineering project

## MVP+ Release Highlights
- Stable daily loop with timezone-safe boundaries
- Single source of truth for completion state: `GET /api/daily-progress/today`
- One Next Action guidance shared by Today Command Center and assistant
- Backend test coverage for daily progress logic (`dotnet test` passes)
- Initial Angular bundle reduced from `524.37 kB` to `450.44 kB`
- Release notes: [RELEASE_NOTES.md](RELEASE_NOTES.md)

## Vision
JARVIS is not a generic dashboard. It is an execution operating system that helps you:
- build financial discipline
- learn .NET and software engineering with deliberate reps
- improve English speaking and communication confidence
- stabilize health, hydration, sleep, and energy
- train focus, reduce distraction, and build identity through action

## Current Capabilities
- Today Command Center with deterministic daily guidance
- Daily guide API: `GET /api/daily-guide/today` with local curated seed content
- Daily progress API: `GET /api/daily-progress/today` as source of truth for today's completion state
- One Next Action system shared by Today Command Center and assistant
- Learning roadmap module with topic progress updates
- Communication module with word-of-the-day and speaking drills
- Wealth Builder with income-first tracking and monthly income summary
- Writing system with diary entries and blog drafts
- Daily mission generation from reusable mission templates
- Mission completion with XP progression signals
- Finance lab for expense tracking and budget awareness
- Mood check-in and guidance adaptation
- Daily checklist logging
- Weekly stats and streak calculations
- Mission history and template management
- Rule-based JARVIS assistant experience
- Behavioral reinforcement layer (acknowledgements + continuity memory)
- Design-system governance + design drift audit (`design:audit`)
- New backend insights endpoint: `GET /api/insights/today`

## Tech Stack
- Frontend: Angular 20, TypeScript, SCSS
- Backend: ASP.NET Core Web API (.NET 10)
- Data: Entity Framework Core + SQL Server LocalDB (dev)
- API Docs: Swagger/OpenAPI
- Styling Governance: Token-based design system + audit script

## Repository Structure
- `frontend/angular-app` Angular client
- `backend/Jarvis.Api` ASP.NET Core API
- `docs` product architecture, scope, and roadmap docs
- `database` database notes/placeholders

## Architecture Overview
- Presentation: Angular standalone components with a token-based SCSS design system
- API layer: ASP.NET Core controllers as HTTP boundary
- Application layer: service classes for daily guide/progress and domain workflows
- Data layer: EF Core `AppDbContext` with SQL Server LocalDB in development
- Governance: design drift checks via `npm run design:audit`

## Quick Start

### 1) Backend
From `backend/Jarvis.Api`:

```powershell
dotnet restore
dotnet run
```

API defaults:
- Swagger (development): `https://localhost:<port>/swagger`
- Core routes under `/api/*`

### 2) Frontend
From `frontend/angular-app`:

```powershell
npm install
npm start
```

Frontend runs at:
- `http://localhost:4200`

## Build & Validation

### Backend
```powershell
dotnet build
dotnet test
```

### Frontend
```powershell
npm run design:audit
npm run build
```

### Full Validation Flow
From repository root:

```powershell
dotnet test "Jarvis Life System.sln"
dotnet build "Jarvis Life System.sln"
```

From `frontend/angular-app`:

```powershell
npm run design:audit
npm run build
```

## API Snapshot
Core endpoints:
- `GET /api/daily-guide/today`
- `GET /api/daily-progress/today`
- `GET /api/missions/today`
- `PUT /api/missions/{id}/complete`
- `GET /api/missions/history?days=30`
- `GET /api/expenses/today`
- `POST /api/expenses`
- `DELETE /api/expenses/{id}`
- `GET /api/stats/streak`
- `GET /api/stats/weekly`
- `GET /api/dailylog/today`
- `POST /api/dailylog/update`
- `GET /api/settings`
- `POST /api/settings`
- `GET /api/mission-templates`
- `POST /api/mission-templates`
- `PUT /api/mission-templates/{id}`
- `DELETE /api/mission-templates/{id}`
- `GET /api/insights/today`
- `GET /api/learning/today`
- `GET /api/learning/roadmap`
- `POST /api/learning/log`
- `PATCH /api/learning/topic-progress`
- `GET /api/communication/today`
- `GET /api/communication/recent`
- `POST /api/communication/log`
- `POST /api/income`
- `GET /api/income/recent`
- `GET /api/income/month-summary`
- `POST /api/diary`
- `GET /api/diary/recent`
- `POST /api/blog-drafts`
- `GET /api/blog-drafts/recent`
- `PATCH /api/blog-drafts/{id}`

## Daily Loop Design
The core product behavior follows one reliable loop:
1. read today's guidance (`/api/daily-guide/today`)
2. execute and log daily actions across learning, communication, mission, wealth, and diary
3. compute completion state from one backend source (`/api/daily-progress/today`)
4. surface exactly one next action to reduce decision fatigue

This keeps the app useful daily instead of noisy or feature-fragmented.

## Behavioral Design Philosophy
- Calm reinforcement over gamified pressure
- One clear next action over multiple competing suggestions
- Consistency loops over intensity spikes
- Measurable daily closure through completion signals and reflection

## Timezone Strategy
Daily progress uses app-local day boundaries from `AppTime:TimeZoneId` (default `America/New_York`).
The backend computes `[startOfDay, startOfNextDay)` in that timezone and applies that range consistently for mission/log detection.
This reduces late-night rollover bugs where actions could otherwise fall into the wrong day.

## Product Architecture Docs
- [Life OS Blueprint](docs/LIFE_OS_BLUEPRINT.md)
- [Technical Improvement Plan](docs/TECHNICAL_IMPROVEMENT_PLAN.md)
- [MVP Scope](docs/MVP_SCOPE.md)
- [Product Plan](docs/PRODUCT_PLAN.md)
- [Validation Checklist](docs/VALIDATION_CHECKLIST.md)

## Learning & Showcase Goals
This codebase is intentionally structured to be readable for a growing .NET/Angular developer:
- clear controller/service/data separation
- request DTO validation for safer APIs
- global exception middleware with ProblemDetails responses
- modular UI components with shared design tokens
- practical, behavior-informed product decisions

## Current Technical Debt
- No authentication/multi-user boundaries yet
- Frontend automated tests are still minimal
- Uses `EnsureCreated` for MVP local DB bootstrap instead of full migrations workflow
- App state is still mainly local to `App` component rather than dedicated state library

## Planned Next Steps
1. Add EF Core migrations and environment-safe DB initialization strategy
2. Expand backend unit tests + add integration tests for critical flows
3. Introduce frontend state orchestration (signals/store) for complex flows
4. Add authenticated profile support and long-horizon progress analytics
5. Expand monthly review and AI assistant coaching depth using module context

## Screenshots
Add repository screenshots/gifs in a future pass:
- `docs/screenshots/dashboard-overview.png`
- `docs/screenshots/finance-lab.png`
- `docs/screenshots/review-mode.png`
