using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Application.Services;

public class LearningLogService
{
    private static readonly IReadOnlyDictionary<string, IReadOnlyList<string>> RoadmapByCategory =
        new Dictionary<string, IReadOnlyList<string>>(StringComparer.OrdinalIgnoreCase)
        {
            ["CSharp"] =
            [
                "Generics, constraints, and collections",
                "LINQ projection and grouping patterns",
                "Async/await and cancellation tokens",
                "Records, pattern matching, and immutability",
                "Error handling with Result-style patterns"
            ],
            ["DotNet"] =
            [
                "Dependency injection lifetimes",
                "Configuration and options pattern",
                "Background services and hosted workers",
                "Logging and observability fundamentals",
                "Testing strategy for services and controllers"
            ],
            ["AspNetCore"] =
            [
                "Minimal APIs vs Controllers",
                "Model validation and ProblemDetails",
                "Middleware ordering and exception handling",
                "Authentication and authorization basics",
                "Caching and response optimization"
            ],
            ["Sql"] =
            [
                "Index fundamentals and query plans",
                "Joins, grouping, and window functions",
                "Normalization and schema design",
                "Transactions, isolation, and consistency",
                "Stored procedures vs application queries"
            ],
            ["Angular"] =
            [
                "Standalone components and architecture",
                "Signals, inputs, and output patterns",
                "Reactive forms for feature modules",
                "HTTP layer and service composition",
                "Performance tuning and rendering strategy"
            ],
            ["TypeScript"] =
            [
                "Type narrowing and discriminated unions",
                "Utility types and mapped types",
                "Generics for reusable domain models",
                "Strict mode error prevention",
                "Type-safe API response modeling"
            ],
            ["SystemDesign"] =
            [
                "API boundary design and contracts",
                "Caching strategy and invalidation",
                "Event-driven workflows and retries",
                "Scalability bottlenecks and tradeoffs",
                "Monitoring and production incident loops"
            ],
            ["GitHub"] =
            [
                "Branch strategy and clean pull requests",
                "Code review communication quality",
                "CI checks and quality gates",
                "Release tagging and rollback routines",
                "Documentation-driven contribution flow"
            ]
        };

    private readonly AppDbContext _dbContext;

    public LearningLogService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<LearningLog> CreateAsync(CreateLearningLogRequest request)
    {
        var createdAt = request.CreatedAt?.ToLocalTime() ?? DateTime.Now;

        var log = new LearningLog
        {
            Topic = request.Topic.Trim(),
            Category = request.Category.Trim(),
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            Difficulty = request.Difficulty,
            CompletedAt = request.CompletedAt?.ToLocalTime() ?? createdAt,
            CreatedAt = createdAt
        };

        _dbContext.LearningLogs.Add(log);
        await _dbContext.SaveChangesAsync();

        return log;
    }

    public async Task<IReadOnlyList<LearningLog>> GetTodayAsync()
    {
        var today = DateTime.Today;

        return await _dbContext.LearningLogs
            .AsNoTracking()
            .Where(log => log.CreatedAt.Date == today)
            .OrderByDescending(log => log.CreatedAt)
            .ThenByDescending(log => log.Id)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<LearningLog>> GetRecentAsync(int take = 20)
    {
        return await _dbContext.LearningLogs
            .AsNoTracking()
            .OrderByDescending(log => log.CreatedAt)
            .ThenByDescending(log => log.Id)
            .Take(take)
            .ToListAsync();
    }

    public async Task<LearningTodayResponse> GetTodayPlanAsync()
    {
        var today = DateTime.Today;
        var dayOfYear = today.DayOfYear;
        var categoryNames = RoadmapByCategory.Keys.OrderBy(name => name).ToArray();
        var category = categoryNames[dayOfYear % categoryNames.Length];
        var topics = RoadmapByCategory[category];
        var topic = topics[(today.Year + dayOfYear) % topics.Count];

        var todayLogCount = await _dbContext.LearningLogs
            .AsNoTracking()
            .CountAsync(log => log.CreatedAt.Date == today);

        return new LearningTodayResponse
        {
            Date = today.ToString("yyyy-MM-dd"),
            Category = category,
            Topic = topic,
            PracticePrompt = $"Ship one concrete output for \"{topic}\" in a 25-minute focused block.",
            TodayLogCount = todayLogCount
        };
    }

    public async Task<LearningRoadmapResponse> GetRoadmapAsync()
    {
        var progressMap = await _dbContext.LearningTopicProgresses
            .AsNoTracking()
            .ToDictionaryAsync(
                progress => $"{progress.Category.Trim().ToLowerInvariant()}::{progress.Topic.Trim().ToLowerInvariant()}",
                progress => progress);

        var categories = RoadmapByCategory
            .Select(categoryEntry =>
            {
                var topics = categoryEntry.Value.Select(topic =>
                {
                    var key = $"{categoryEntry.Key.ToLowerInvariant()}::{topic.ToLowerInvariant()}";
                    var progress = progressMap.GetValueOrDefault(key);

                    return new LearningRoadmapTopicResponse
                    {
                        Topic = topic,
                        Status = progress?.Status ?? "NotStarted",
                        ConfidenceLevel = progress?.ConfidenceLevel ?? 1,
                        LastPracticedAt = progress?.LastPracticedAt
                    };
                }).ToList();

                return new LearningRoadmapCategoryResponse
                {
                    Name = categoryEntry.Key,
                    Topics = topics
                };
            })
            .OrderBy(category => category.Name)
            .ToList();

        return new LearningRoadmapResponse
        {
            Categories = categories
        };
    }

    public async Task<LearningTopicProgress> UpsertTopicProgressAsync(UpdateLearningTopicProgressRequest request)
    {
        var normalizedTopic = request.Topic.Trim();
        var normalizedCategory = request.Category.Trim();

        var existing = await _dbContext.LearningTopicProgresses.FirstOrDefaultAsync(progress =>
            progress.Topic == normalizedTopic &&
            progress.Category == normalizedCategory);

        if (existing is null)
        {
            existing = new LearningTopicProgress
            {
                Topic = normalizedTopic,
                Category = normalizedCategory
            };

            _dbContext.LearningTopicProgresses.Add(existing);
        }

        existing.Status = request.Status.Trim();
        existing.ConfidenceLevel = request.ConfidenceLevel;
        existing.LastPracticedAt = request.LastPracticedAt?.ToLocalTime() ?? DateTime.Now;

        await _dbContext.SaveChangesAsync();
        return existing;
    }
}
