# JARVIS Life System

JARVIS Life System is a beginner-friendly MVP for a gamified personal guidance app.

The current version helps you:
- track daily missions
- earn XP
- see your current level
- view a simple streak placeholder
- log daily expenses
- get a next-action message
- review your day in one dashboard

## Features Completed

- Daily missions dashboard
- Mission completion
- XP, level, and daily completion summary
- Frontend-only reset day button
- Focus highlight for the next recommended mission
- Finance Lab for adding and deleting today's expenses
- JARVIS Next Action guidance using missions and expenses
- Training Room with rotating hardcoded prompts
- Weekly Review summary panel
- Demo mode warning banner
- ASP.NET Core Web API for missions and expenses
- Entity Framework Core persistence
- SQL Server LocalDB database

## Tech Stack

- Frontend: Angular 20
- Backend: ASP.NET Core Web API on .NET 10
- Database: SQL Server LocalDB
- ORM: Entity Framework Core
- Styling: SCSS

## Project Structure

- `frontend/angular-app` - Angular dashboard app
- `backend/Jarvis.Api` - ASP.NET Core Web API
- `database/sqlserver` - database notes and placeholder folders
- `docs` - product and MVP documentation

## How To Run Frontend

Open a terminal in `frontend/angular-app` and run:

```powershell
npm install
npm start
```

The Angular app runs at:
- `http://localhost:4200`

## How To Run Backend

Open a terminal in `backend/Jarvis.Api` and run:

```powershell
dotnet run
```

The API runs locally and exposes endpoints for:
- missions
- expenses

Swagger is available in development when the API starts.

## Database

The current database is:
- SQL Server LocalDB

Connection string location:
- `backend/Jarvis.Api/appsettings.json`

Current database name:
- `JarvisLifeDb`

## Current Limitations

- The dashboard is still one large Angular component
- Reset Day is frontend-only and does not update the backend
- Streak is hardcoded and not stored in the database yet
- Training Room prompts are hardcoded
- Guidance is rule-based only and not AI-powered
- Weekly Review is based on today's data only
- No authentication or multi-user support
- No formal EF Core migrations workflow yet because the app currently uses `EnsureCreated()`

## Next Planned Features

- Real streak tracking in the database
- Better daily reset and day history
- Dashboard component split into smaller Angular components
- Proper EF Core migrations
- Expense categories and richer finance insights
- Weekly and monthly review history
- Smarter guidance engine
- Authentication and personal profiles
