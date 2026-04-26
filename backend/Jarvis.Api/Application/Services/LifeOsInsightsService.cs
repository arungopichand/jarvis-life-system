using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Application.Services;

public class LifeOsInsightsService
{
    private readonly AppDbContext _dbContext;

    public LifeOsInsightsService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<LifeOsInsightsResponse> BuildTodayInsightsAsync()
    {
        var today = DateTime.Today;

        var missions = await _dbContext.Missions
            .AsNoTracking()
            .Where(m => m.MissionDate.Date == today)
            .ToListAsync();

        var expenses = await _dbContext.Expenses
            .AsNoTracking()
            .Where(e => e.ExpenseDate.Date == today)
            .ToListAsync();

        var dailyLog = await _dbContext.DailyLogs
            .AsNoTracking()
            .FirstOrDefaultAsync(log => log.Date.Date == today);

        var settings = await _dbContext.UserSettings
            .AsNoTracking()
            .OrderBy(s => s.Id)
            .FirstOrDefaultAsync();

        var completedMissions = missions.Count(m => m.IsCompleted);
        var completionRate = missions.Count == 0
            ? 0
            : (int)Math.Round((double)completedMissions / missions.Count * 100);

        var totalSpent = expenses.Sum(e => e.Amount);
        var spendingLimit = settings?.DailySpendingLimit ?? 500m;
        var withinLimit = totalSpent <= spendingLimit;
        var financialScore = spendingLimit <= 0
            ? 0
            : Math.Clamp((int)Math.Round((1 - (double)(Math.Max(totalSpent - spendingLimit, 0) / spendingLimit)) * 100), 0, 100);

        var checklistScore = (dailyLog?.MorningCompleted == true ? 10 : 0) + (dailyLog?.NightCompleted == true ? 10 : 0);
        var disciplineScore = Math.Clamp((completionRate / 2) + (financialScore / 3) + checklistScore, 0, 100);

        var learningCompleted = missions.Any(m =>
            m.IsCompleted && m.Category.Contains("skill", StringComparison.OrdinalIgnoreCase));

        var communicationCompleted = missions.Any(m =>
            m.IsCompleted && (
                m.Category.Contains("communication", StringComparison.OrdinalIgnoreCase) ||
                m.Title.Contains("english", StringComparison.OrdinalIgnoreCase)));

        var healthCompleted = missions.Any(m =>
            m.IsCompleted && m.Category.Contains("health", StringComparison.OrdinalIgnoreCase));

        var recommendedActions = BuildRecommendedActions(
            missions.Count,
            completedMissions,
            learningCompleted,
            communicationCompleted,
            healthCompleted,
            withinLimit,
            spendingLimit,
            totalSpent);

        return new LifeOsInsightsResponse
        {
            Date = today.ToString("yyyy-MM-dd"),
            DisciplineScore = disciplineScore,
            FinancialDisciplineScore = financialScore,
            ExecutiveSummary = BuildExecutiveSummary(disciplineScore, completionRate, withinLimit),
            FinanceInsight = withinLimit
                ? $"You are within budget. Remaining today: {(spendingLimit - totalSpent):0.00}."
                : $"Budget exceeded by {(totalSpent - spendingLimit):0.00}. Pause spending and keep progress low-cost.",
            LearningInsight = learningCompleted
                ? "Learning mission completed. Convert it into one concrete coding output before day-end."
                : $"No learning mission completed yet. Run one 25-minute block on {(settings?.MainSkill ?? ".NET")}.",
            CommunicationInsight = communicationCompleted
                ? "Communication practice logged. Add one extra speaking repetition to reinforce fluency."
                : "No communication mission recorded yet. Do a 2-minute speaking drill now.",
            HealthInsight = healthCompleted
                ? "Health mission completed. Protect energy with hydration and sleep consistency."
                : "Health task still open. Complete one body-system mission to stabilize energy.",
            FocusInsight = completionRate >= 70
                ? "Execution is stable. Protect momentum with one uninterrupted deep-work block."
                : "Execution is below target. Lower friction and finish the easiest unfinished mission next.",
            RecommendedActions = recommendedActions
        };
    }

    private static string BuildExecutiveSummary(int disciplineScore, int completionRate, bool withinLimit)
    {
        if (disciplineScore >= 80)
        {
            return "Strong operating day. Stay deliberate, avoid context switching, and finish clean.";
        }

        if (disciplineScore >= 55)
        {
            return "Solid base. One more focused mission will push today into high-quality execution.";
        }

        return withinLimit && completionRate == 0
            ? "You are preserving resources but need immediate action. Complete one short mission now."
            : "Today needs stabilization. Simplify the next step and rebuild momentum through action.";
    }

    private static IReadOnlyList<string> BuildRecommendedActions(
        int missionCount,
        int completedMissions,
        bool learningCompleted,
        bool communicationCompleted,
        bool healthCompleted,
        bool withinLimit,
        decimal spendingLimit,
        decimal totalSpent)
    {
        var actions = new List<string>();

        if (missionCount == 0)
        {
            actions.Add("Create tomorrow's mission templates so the next day starts with clear direction.");
        }
        else if (completedMissions == 0)
        {
            actions.Add("Complete the easiest mission now to restart momentum.");
        }

        if (!withinLimit)
        {
            actions.Add($"Stop discretionary spending for today. You are over limit by {(totalSpent - spendingLimit):0.00}.");
        }

        if (!learningCompleted)
        {
            actions.Add("Schedule a 25-minute .NET block and ship one small coding output.");
        }

        if (!communicationCompleted)
        {
            actions.Add("Run one 2-minute English speaking drill and record your best attempt.");
        }

        if (!healthCompleted)
        {
            actions.Add("Complete one health action now (hydration, sleep prep, or workout block).");
        }

        if (actions.Count == 0)
        {
            actions.Add("Log one reflection from today's wins and define tomorrow's first mission.");
        }

        return actions;
    }
}
