# Validation Checklist

Use this quality gate before committing or opening a PR.

## Backend

From repository root:

```powershell
dotnet test "Jarvis Life System.sln"
dotnet build "Jarvis Life System.sln"
```

## Frontend

From `frontend/angular-app`:

```powershell
npm run design:audit
npm run build
```

## Expected Outcome
- tests pass
- .NET build succeeds
- design audit passes with no component-level hardcoded color errors
- Angular production build succeeds
