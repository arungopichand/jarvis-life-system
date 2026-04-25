# ASP.NET Core Web API

MVP API structure for JARVIS Life System.

## Current MVP Endpoints

- `GET /api/missions/today`
- `PUT /api/missions/{id}/complete`
- `GET /api/expenses/today`
- `POST /api/expenses`
- `DELETE /api/expenses/{id}`
- `GET /api/stats/streak`
- `GET /api/stats/weekly`
- `GET /api/dailylog/today`
- `POST /api/dailylog/update`

## Database Setup

This project currently uses `EnsureCreated()` for a beginner-friendly local MVP setup.

At startup, the API now checks whether the expected tables exist:

- `Missions`
- `Expenses`
- `DailyLogs`

If the database exists but one of those tables is missing, the API will delete and recreate the local LocalDB database automatically so the schema matches the current code.

This is acceptable for the local MVP because the app uses demo data and no authentication yet.

## When The Schema Changes

If you add a new model or `DbSet`, you can reset the local database manually with:

```powershell
dotnet ef database drop --force
dotnet run
```

Run those commands from:

```powershell
backend/Jarvis.Api
```

## Code Areas

- `Controllers` - HTTP endpoints
- `Application` - mission and progression use cases
- `Domain` - core entities and rules
- `Infrastructure` - data access and external integrations
- `Contracts` - request and response models

## Deployment Notes

### Environment Configuration

The API now reads configuration by environment:

- `appsettings.json` - shared settings
- `appsettings.Development.json` - local development settings
- `appsettings.Production.json` - production settings

### Connection Strings

Development uses LocalDB only:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=JarvisLifeDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

Production uses a placeholder SQL connection string in `appsettings.Production.json`.
Replace it before deployment with your real production SQL Server or Azure SQL connection string.

### CORS

Allowed frontend origins are configured in `appsettings.json` under:

```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:4200",
    "https://your-frontend-url.com"
  ]
}
```

Before production deployment:

1. Replace `https://your-frontend-url.com` with your real frontend URL.
2. Replace the production SQL connection string placeholder.
3. Set `ASPNETCORE_ENVIRONMENT=Production` on the server.

### Build

Run from `backend/Jarvis.Api`:

```powershell
dotnet build
```
