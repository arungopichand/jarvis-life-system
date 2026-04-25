# MVP Scope

## Current MVP Status

The MVP is now a working full-stack dashboard with Angular, ASP.NET Core Web API, and SQL Server LocalDB.

## Features Completed

- Show today's missions
- Mark missions as complete
- Show XP earned today
- Show total possible XP
- Show current level
- Show daily completion percentage
- Show simple streak placeholder
- Show next-action guidance
- Add and delete today's expenses
- Show total spent today
- Show weekly review summary
- Show training prompts for English, confidence, and typing
- Persist missions and expenses with Entity Framework Core and LocalDB

## Tech Stack

- Angular 20 frontend
- ASP.NET Core Web API backend
- Entity Framework Core
- SQL Server LocalDB
- SCSS styling

## In Scope Right Now

- Single dashboard experience
- Daily missions
- XP and level progress
- Expense tracking for today
- Rule-based guidance
- Training prompts
- Weekly review summary
- Local database persistence

## Out Of Scope For Now

- AI-generated coaching
- User accounts
- Multi-device sync
- Notifications
- Advanced analytics
- Social features
- Real streak persistence
- Historical reporting across many days

## Current Limitations

- Reset Day only changes the frontend view
- Streak values are placeholders
- Training Room content is hardcoded
- Guidance rules are simple and local
- Weekly Review uses today's dashboard data only
- The Angular dashboard is still in one main component
- Database setup uses LocalDB, which is best for local development

## MVP User Flow

1. Open the dashboard
2. Review today's missions
3. Complete one or more missions
4. Log today's expenses in Finance Lab
5. Read the JARVIS Next Action guidance
6. Use the Training Room prompts
7. Check the Weekly Review summary

## Next Planned Features

- Real streak system
- Persistent day reset flow
- Component-based Angular cleanup
- Proper EF Core migrations
- More finance summaries
- Better review history
- Smarter guidance
