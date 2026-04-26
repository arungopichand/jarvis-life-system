using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Application.Services;

public class DailyProgressService
{
    private readonly AppDbContext _dbContext;
    private readonly IAppTimeService _appTimeService;

    public DailyProgressService(AppDbContext dbContext, IAppTimeService appTimeService)
    {
        _dbContext = dbContext;
        _appTimeService = appTimeService;
    }

    public async Task<DailyProgressTodayResponse> GetTodayAsync()
    {
        var today = _appTimeService.GetTodayLocalDate();
        var dayStart = _appTimeService.GetStartOfTodayLocal();
        var dayEnd = _appTimeService.GetStartOfTomorrowLocal();

        var completedMissionsCount = await _dbContext.Missions
            .AsNoTracking()
            .CountAsync(mission => mission.MissionDate >= dayStart && mission.MissionDate < dayEnd && mission.IsCompleted);

        var learningLoggedToday = await _dbContext.LearningLogs
            .AsNoTracking()
            .AnyAsync(log => log.CreatedAt >= dayStart && log.CreatedAt < dayEnd);

        var communicationLoggedToday = await _dbContext.CommunicationLogs
            .AsNoTracking()
            .AnyAsync(log => log.CreatedAt >= dayStart && log.CreatedAt < dayEnd);

        var diaryWrittenToday = await _dbContext.DiaryEntries
            .AsNoTracking()
            .AnyAsync(entry => entry.CreatedAt >= dayStart && entry.CreatedAt < dayEnd);

        var incomeLoggedToday = await _dbContext.IncomeLogs
            .AsNoTracking()
            .AnyAsync(log => log.CreatedAt >= dayStart && log.CreatedAt < dayEnd);

        var dailyLog = await _dbContext.DailyLogs
            .AsNoTracking()
            .FirstOrDefaultAsync(log => log.Date >= dayStart && log.Date < dayEnd);

        var checklistProgress = dailyLog is null
            ? (int?)null
            : (dailyLog.MorningCompleted ? 50 : 0) + (dailyLog.NightCompleted ? 50 : 0);

        var missionCompletedToday = completedMissionsCount > 0;
        var completedCoreAreas = CountCompletedCoreAreas(
            missionCompletedToday,
            learningLoggedToday,
            communicationLoggedToday,
            diaryWrittenToday,
            incomeLoggedToday);

        var coreCompletionScore = (int)Math.Round(completedCoreAreas / 5d * 100d);
        var dayCompletionScore = checklistProgress.HasValue
            ? (int)Math.Round((coreCompletionScore * 0.8d) + (checklistProgress.Value * 0.2d))
            : coreCompletionScore;

        return new DailyProgressTodayResponse
        {
            Date = today.ToString("yyyy-MM-dd"),
            CompletedMissionsCount = completedMissionsCount,
            LearningLoggedToday = learningLoggedToday,
            CommunicationLoggedToday = communicationLoggedToday,
            DiaryWrittenToday = diaryWrittenToday,
            IncomeLoggedToday = incomeLoggedToday,
            ChecklistProgress = checklistProgress,
            DayCompletionScore = dayCompletionScore,
            NextRecommendedAction = BuildNextRecommendedAction(
                missionCompletedToday,
                learningLoggedToday,
                communicationLoggedToday,
                diaryWrittenToday,
                incomeLoggedToday,
                checklistProgress)
        };
    }

    private static int CountCompletedCoreAreas(
        bool missionCompletedToday,
        bool learningLoggedToday,
        bool communicationLoggedToday,
        bool diaryWrittenToday,
        bool incomeLoggedToday)
    {
        return (missionCompletedToday ? 1 : 0)
            + (learningLoggedToday ? 1 : 0)
            + (communicationLoggedToday ? 1 : 0)
            + (diaryWrittenToday ? 1 : 0)
            + (incomeLoggedToday ? 1 : 0);
    }

    private static string BuildNextRecommendedAction(
        bool missionCompletedToday,
        bool learningLoggedToday,
        bool communicationLoggedToday,
        bool diaryWrittenToday,
        bool incomeLoggedToday,
        int? checklistProgress)
    {
        if (!learningLoggedToday)
        {
            return "Complete today's learning log after one focused study block.";
        }

        if (!communicationLoggedToday)
        {
            return "Practice one English communication rep and log it.";
        }

        if (!missionCompletedToday)
        {
            return "Complete your highest-impact mission and mark it done.";
        }

        if (!incomeLoggedToday)
        {
            return "Log one income or wealth action to keep financial momentum.";
        }

        if (!diaryWrittenToday)
        {
            return "Write your diary reflection to close the day loop.";
        }

        if (checklistProgress.HasValue && checklistProgress.Value < 100)
        {
            return "Finish your daily checklist to close the day cleanly.";
        }

        return "Review today's wins and set tomorrow's first mission.";
    }
}
