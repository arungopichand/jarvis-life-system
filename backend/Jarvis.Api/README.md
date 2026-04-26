# JARVIS API (.NET 10)

Backend API for the JARVIS Life System.

## Responsibilities
- manage daily missions and mission templates
- track expenses and user settings
- compute weekly + streak stats
- persist daily checklist state
- provide a daily Life OS insights summary
- provide local-day completion state and one next action recommendation

## Key Endpoints
- `GET /api/daily-guide/today`
- `GET /api/daily-progress/today`
- `GET /api/missions/today`
- `GET /api/missions/history?days=30`
- `POST /api/missions`
- `PUT /api/missions/{id}/complete`
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

## Daily Progress Strategy
`/api/daily-progress/today` is the source of truth for:
- completed mission count
- learning/communication/diary/income completion flags
- checklist progress
- day completion score
- one next recommended action

Date boundaries are computed using `AppTime:TimeZoneId` (default `America/New_York`) and applied as
`[startOfDay, startOfNextDay)` to avoid late-night rollover errors.

## Code Layout
- `Controllers` HTTP boundary
- `Contracts` request/response DTOs
- `Application/Services` use-case services (including insights)
- `Data` EF Core context + startup DB initializer
- `Infrastructure/Middleware` cross-cutting concerns (global exception handling)
- `Models` persistence/domain entities

## API Quality Features
- data-annotation request validation for create/update DTOs
- centralized exception handling with ProblemDetails responses
- environment-based config (`appsettings.*.json`)

## Database
Current strategy is MVP-friendly local bootstrap via `EnsureCreated()` with schema guard checks.

Expected tables:
- `Missions`
- `MissionTemplates`
- `Expenses`
- `DailyLogs`
- `UserSettings`

For local reset:

```powershell
dotnet ef database drop --force
dotnet run
```

## Run
From `backend/Jarvis.Api`:

```powershell
dotnet restore
dotnet run
```

Swagger is enabled in development.

## Tests
From repository root:

```powershell
dotnet test
```
