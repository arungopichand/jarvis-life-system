# MVP Architecture

## System Overview
- Frontend: Angular single-page app with modular component panels
- Backend: ASP.NET Core Web API with EF Core persistence
- Database: SQL Server LocalDB (development MVP)

## Backend Layers
- Controllers: API endpoints and transport concerns
- Contracts: request/response DTOs
- Application Services: orchestration/business computations
- Data: `AppDbContext` and bootstrap initialization
- Infrastructure: middleware and cross-cutting behavior
- Models: persisted entities

## Frontend Layers
- Components: focused UI modules per life domain
- Services: HTTP clients for API integration
- Models: shared TypeScript interfaces
- Styles: token system in `styles.scss`, shell integration in `app.scss`
- Governance: `design:audit` script to prevent style drift

## Data Flow
1. Angular service requests data from API
2. Controllers validate and map DTOs to model changes
3. EF Core persists to SQL Server LocalDB
4. Stats/insights endpoints aggregate mission + expense + checklist signals
5. Frontend renders guidance and reinforcement cues

## MVP Constraints
- No authentication or tenant boundaries
- Minimal test coverage
- `EnsureCreated` database bootstrap strategy
- Root component still handles most orchestration state

