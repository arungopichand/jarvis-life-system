using Jarvis.Api.Application.Services;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace Jarvis.Api.Tests;

public class DailyProgressServiceTests
{
    private static readonly DateTime Today = new(2026, 04, 26, 0, 0, 0);
    private static readonly DateTime TodayNoon = new(2026, 04, 26, 12, 0, 0);

    [Fact]
    public async Task GetTodayAsync_EmptyDay_ReturnsPendingDefaults()
    {
        await using var dbContext = CreateDbContext();
        var service = CreateService(dbContext);

        var result = await service.GetTodayAsync();

        Assert.Equal("2026-04-26", result.Date);
        Assert.Equal(0, result.CompletedMissionsCount);
        Assert.False(result.LearningLoggedToday);
        Assert.False(result.CommunicationLoggedToday);
        Assert.False(result.DiaryWrittenToday);
        Assert.False(result.IncomeLoggedToday);
        Assert.Null(result.ChecklistProgress);
        Assert.Equal(0, result.DayCompletionScore);
        Assert.Equal("Complete today's learning log after one focused study block.", result.NextRecommendedAction);
    }

    [Fact]
    public async Task GetTodayAsync_MissionCompletedOnly_CountsMissionAndSuggestsLearning()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Missions.Add(new Mission
        {
            Title = "Ship API endpoint",
            Category = "Execution",
            XpReward = 100,
            IsCompleted = true,
            MissionDate = TodayNoon
        });
        await dbContext.SaveChangesAsync();

        var service = CreateService(dbContext);
        var result = await service.GetTodayAsync();

        Assert.Equal(1, result.CompletedMissionsCount);
        Assert.Equal(20, result.DayCompletionScore);
        Assert.Equal("Complete today's learning log after one focused study block.", result.NextRecommendedAction);
    }

    [Fact]
    public async Task GetTodayAsync_LearningLoggedOnly_DetectsLearningAndSuggestsCommunication()
    {
        await using var dbContext = CreateDbContext();
        dbContext.LearningLogs.Add(new LearningLog
        {
            Topic = "Async/await",
            Category = "DotNet",
            Difficulty = 3,
            CreatedAt = TodayNoon
        });
        await dbContext.SaveChangesAsync();

        var service = CreateService(dbContext);
        var result = await service.GetTodayAsync();

        Assert.True(result.LearningLoggedToday);
        Assert.Equal(20, result.DayCompletionScore);
        Assert.Equal("Practice one English communication rep and log it.", result.NextRecommendedAction);
    }

    [Fact]
    public async Task GetTodayAsync_AllCoreItemsCompleted_ReturnsChecklistFollowUpWhenPartial()
    {
        await using var dbContext = CreateDbContext();
        SeedAllCoreItemsCompleted(dbContext);
        dbContext.DailyLogs.Add(new DailyLog
        {
            Date = Today,
            MorningCompleted = true,
            NightCompleted = false
        });
        await dbContext.SaveChangesAsync();

        var service = CreateService(dbContext);
        var result = await service.GetTodayAsync();

        Assert.Equal(50, result.ChecklistProgress);
        Assert.Equal(90, result.DayCompletionScore);
        Assert.Equal("Finish your daily checklist to close the day cleanly.", result.NextRecommendedAction);
    }

    [Fact]
    public async Task GetTodayAsync_ChecklistPartialCompletion_ComputesProgressAndScore()
    {
        await using var dbContext = CreateDbContext();
        dbContext.LearningLogs.Add(new LearningLog
        {
            Topic = "LINQ",
            Category = "CSharp",
            Difficulty = 2,
            CreatedAt = TodayNoon
        });
        dbContext.DailyLogs.Add(new DailyLog
        {
            Date = Today,
            MorningCompleted = true,
            NightCompleted = false
        });
        await dbContext.SaveChangesAsync();

        var service = CreateService(dbContext);
        var result = await service.GetTodayAsync();

        Assert.Equal(50, result.ChecklistProgress);
        Assert.Equal(26, result.DayCompletionScore);
    }

    [Fact]
    public async Task GetTodayAsync_NextActionPriority_ChoosesIncomeBeforeDiaryWhenOnlyThoseMissing()
    {
        await using var dbContext = CreateDbContext();
        dbContext.Missions.Add(new Mission
        {
            Title = "Deep work block",
            Category = "Execution",
            XpReward = 100,
            IsCompleted = true,
            MissionDate = TodayNoon
        });
        dbContext.LearningLogs.Add(new LearningLog
        {
            Topic = "Dependency injection",
            Category = "DotNet",
            Difficulty = 3,
            CreatedAt = TodayNoon
        });
        dbContext.CommunicationLogs.Add(new CommunicationLog
        {
            Type = "Vocabulary",
            Content = "Deliberate",
            ConfidenceLevel = 4,
            CreatedAt = TodayNoon
        });
        await dbContext.SaveChangesAsync();

        var service = CreateService(dbContext);
        var result = await service.GetTodayAsync();

        Assert.Equal("Log one income or wealth action to keep financial momentum.", result.NextRecommendedAction);
    }

    [Fact]
    public async Task GetTodayAsync_CompletedItemsOutsideTodayRange_AreNotCounted()
    {
        await using var dbContext = CreateDbContext();
        dbContext.LearningLogs.Add(new LearningLog
        {
            Topic = "Yesterday study",
            Category = "DotNet",
            Difficulty = 2,
            CreatedAt = Today.AddMinutes(-1)
        });
        dbContext.LearningLogs.Add(new LearningLog
        {
            Topic = "Today study",
            Category = "DotNet",
            Difficulty = 3,
            CreatedAt = Today.AddHours(1)
        });
        await dbContext.SaveChangesAsync();

        var service = CreateService(dbContext);
        var result = await service.GetTodayAsync();

        Assert.True(result.LearningLoggedToday);
        Assert.Equal(20, result.DayCompletionScore);
    }

    private static void SeedAllCoreItemsCompleted(AppDbContext dbContext)
    {
        dbContext.Missions.Add(new Mission
        {
            Title = "Complete mission",
            Category = "Execution",
            XpReward = 100,
            IsCompleted = true,
            MissionDate = TodayNoon
        });
        dbContext.LearningLogs.Add(new LearningLog
        {
            Topic = "Topic",
            Category = "DotNet",
            Difficulty = 3,
            CreatedAt = TodayNoon
        });
        dbContext.CommunicationLogs.Add(new CommunicationLog
        {
            Type = "Speaking",
            Content = "Practice",
            ConfidenceLevel = 4,
            CreatedAt = TodayNoon
        });
        dbContext.DiaryEntries.Add(new DiaryEntry
        {
            Mood = "Focused",
            Content = "Daily reflection",
            ReflectionPrompt = "Prompt",
            CreatedAt = TodayNoon
        });
        dbContext.IncomeLogs.Add(new IncomeLog
        {
            Source = "Freelance",
            Amount = 200m,
            CreatedAt = TodayNoon
        });
    }

    private static DailyProgressService CreateService(AppDbContext dbContext)
    {
        var appTimeService = new FixedAppTimeService(Today);
        return new DailyProgressService(dbContext, appTimeService);
    }

    private static AppDbContext CreateDbContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString("N"))
            .Options;

        return new AppDbContext(options);
    }

    private sealed class FixedAppTimeService : IAppTimeService
    {
        private readonly DateTime _today;

        public FixedAppTimeService(DateTime today)
        {
            _today = today.Date;
        }

        public DateTime GetTodayLocalDate() => _today;

        public DateTime GetStartOfTodayLocal() => _today;

        public DateTime GetStartOfTomorrowLocal() => _today.AddDays(1);
    }
}
