using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public StatsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("streak")]
    public async Task<ActionResult<StreakStatsResponse>> GetStreak()
    {
        var missions = await _dbContext.Missions
            .AsNoTracking()
            .ToListAsync();

        if (missions.Count == 0)
        {
            return Ok(new StreakStatsResponse());
        }

        var dailyResults = missions
            .GroupBy(m => m.MissionDate.Date)
            .Select(group => new DailyMissionResult
            {
                Date = group.Key,
                CompletionPercentage = GetCompletionPercentage(group.Count(), group.Count(m => m.IsCompleted))
            })
            .OrderBy(result => result.Date)
            .ToList();

        var longestStreak = 0;
        var currentRun = 0;
        DateTime? previousSuccessfulDate = null;

        foreach (var day in dailyResults)
        {
            if (day.CompletionPercentage >= 70)
            {
                if (previousSuccessfulDate.HasValue && previousSuccessfulDate.Value.AddDays(1) == day.Date)
                {
                    currentRun++;
                }
                else
                {
                    currentRun = 1;
                }

                previousSuccessfulDate = day.Date;

                if (currentRun > longestStreak)
                {
                    longestStreak = currentRun;
                }
            }
            else
            {
                currentRun = 0;
                previousSuccessfulDate = null;
            }
        }

        var currentStreak = GetCurrentStreak(dailyResults);

        return Ok(new StreakStatsResponse
        {
            CurrentStreak = currentStreak,
            LongestStreak = longestStreak
        });
    }

    private static int GetCurrentStreak(List<DailyMissionResult> dailyResults)
    {
        var today = DateTime.Today;
        var todayResult = dailyResults.LastOrDefault(day => day.Date == today);

        if (todayResult is null || todayResult.CompletionPercentage < 70)
        {
            return 0;
        }

        var currentStreak = 0;
        DateTime? nextSuccessfulDate = null;

        for (var index = dailyResults.Count - 1; index >= 0; index--)
        {
            var day = dailyResults[index];

            if (day.CompletionPercentage < 70)
            {
                break;
            }

            if (nextSuccessfulDate.HasValue && day.Date.AddDays(1) != nextSuccessfulDate.Value)
            {
                break;
            }

            currentStreak++;
            nextSuccessfulDate = day.Date;
        }

        return currentStreak;
    }

    private static int GetCompletionPercentage(int totalMissions, int completedMissions)
    {
        if (totalMissions == 0)
        {
            return 0;
        }

        return (int)Math.Round((double)completedMissions / totalMissions * 100);
    }

    private class DailyMissionResult
    {
        public DateTime Date { get; set; }

        public int CompletionPercentage { get; set; }
    }
}
