using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Application.Services;

public class IncomeService
{
    private const decimal DefaultMonthlyIncomeGoal = 5000m;
    private const decimal DefaultSavingsGoal = 1500m;

    private readonly AppDbContext _dbContext;

    public IncomeService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<IncomeLog> CreateAsync(CreateIncomeLogRequest request)
    {
        var log = new IncomeLog
        {
            Source = request.Source.Trim(),
            Amount = request.Amount,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            CreatedAt = request.CreatedAt?.ToLocalTime() ?? DateTime.Now
        };

        _dbContext.IncomeLogs.Add(log);
        await _dbContext.SaveChangesAsync();
        return log;
    }

    public async Task<IReadOnlyList<IncomeLog>> GetRecentAsync(int take = 20)
    {
        return await _dbContext.IncomeLogs
            .AsNoTracking()
            .OrderByDescending(log => log.CreatedAt)
            .ThenByDescending(log => log.Id)
            .Take(take)
            .ToListAsync();
    }

    public async Task<IncomeMonthSummaryResponse> GetCurrentMonthSummaryAsync()
    {
        var now = DateTime.Today;
        var monthStart = new DateTime(now.Year, now.Month, 1);
        var monthEnd = monthStart.AddMonths(1);

        var entries = await _dbContext.IncomeLogs
            .AsNoTracking()
            .Where(log => log.CreatedAt >= monthStart && log.CreatedAt < monthEnd)
            .ToListAsync();

        var totalIncome = entries.Sum(entry => entry.Amount);
        var goalProgress = DefaultMonthlyIncomeGoal <= 0
            ? 0
            : Math.Round((totalIncome / DefaultMonthlyIncomeGoal) * 100m, 2);

        return new IncomeMonthSummaryResponse
        {
            Year = now.Year,
            Month = now.Month,
            TotalIncome = totalIncome,
            EntriesCount = entries.Count,
            MonthlyIncomeGoal = DefaultMonthlyIncomeGoal,
            SavingsGoal = DefaultSavingsGoal,
            GoalProgressPercentage = goalProgress
        };
    }
}
