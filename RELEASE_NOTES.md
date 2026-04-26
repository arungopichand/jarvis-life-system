# JARVIS Life OS - MVP+ Release Notes

## Release Summary
MVP+ focuses on making the daily loop reliable, testable, and portfolio-ready without expanding into new major modules.

## Key Features
- Today Command Center as the primary daily operating surface
- Daily Guide API (`GET /api/daily-guide/today`) for deterministic daily prompts
- Daily Progress API (`GET /api/daily-progress/today`) as completion source of truth
- One Next Action system used consistently across dashboard and assistant
- Learning, Communication, Wealth, Writing, and Missions integrated into one daily flow
- Design-system governance via `npm run design:audit`

## Architecture Highlights
- Backend: ASP.NET Core Web API with controller/service separation
- Data: EF Core + SQL Server LocalDB (development)
- Frontend: Angular standalone component architecture with deferred loading for non-primary sections
- Timezone-safe day boundary strategy with app-configurable `AppTime:TimeZoneId`
- Focused backend tests for `DailyProgressService`

## Validation Status
Validated with:
- `dotnet test "Jarvis Life System.sln" -maxcpucount:1 -nodeReuse:false`
- `dotnet build "Jarvis Life System.sln" -maxcpucount:1 -nodeReuse:false`
- `npm run design:audit`
- `npm run build`

Latest status: passing.

## Performance Result
- Angular initial bundle reduced from **524.37 kB** to **450.44 kB**
- Reduction achieved with safe deferred loading of non-primary views/sections, without feature or behavior changes

## Known Limitations
- No authentication or multi-user boundaries yet
- Frontend automated test coverage is still minimal
- Development database bootstrap still relies on `EnsureCreated` instead of full migrations workflow
- App state remains centered in root component rather than a dedicated state library

## Next Roadmap
1. Introduce EF Core migrations and production-safe DB initialization
2. Expand backend tests to integration coverage for key daily-loop APIs
3. Add frontend test coverage for critical daily flow interactions
4. Introduce stronger state orchestration for complex UI workflows
5. Add authenticated user profile support and long-horizon analytics
