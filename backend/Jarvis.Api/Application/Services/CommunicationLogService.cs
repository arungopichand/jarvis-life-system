using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Application.Services;

public class CommunicationLogService
{
    private static readonly IReadOnlyList<(string Word, string Meaning, string ExampleSentence)> Vocabulary =
    [
        ("Deliberate", "Done with conscious and careful intention.", "I am deliberate with my time and attention today."),
        ("Resilient", "Able to recover quickly after setbacks.", "A resilient engineer learns from each failed attempt."),
        ("Concise", "Expressing ideas clearly in a few words.", "My status update should be concise and concrete."),
        ("Accountable", "Willing to take responsibility for outcomes.", "Strong teams are accountable for both wins and misses."),
        ("Persistent", "Continuing firmly despite difficulty.", "Persistent practice improves speaking confidence."),
        ("Strategic", "Focused on long-term outcomes and leverage.", "She made a strategic decision to automate repetitive work.")
    ];

    private static readonly IReadOnlyList<string> SpeakingPrompts =
    [
        "Explain one technical concept in simple English as if teaching a beginner.",
        "Describe your current project goal in under 90 seconds.",
        "Tell a short story about a challenge you solved at work.",
        "Practice a mock interview answer: \"Tell me about yourself.\"",
        "Summarize today's learning topic and why it matters.",
        "Give a confident update: what you completed, what is next, and any blocker."
    ];

    private static readonly IReadOnlyList<string> ConfidenceDrills =
    [
        "Read your answer aloud twice: first for clarity, second for confidence.",
        "Stand tall, slow your pace, and hold eye contact for two full sentences.",
        "Record a one-minute voice note and replay it once without self-criticism.",
        "Start with a decisive opening sentence: \"Here is my recommendation.\"",
        "Use one short pause before your key point to sound composed.",
        "End with a clear close: \"That is my current approach.\""
    ];

    private readonly AppDbContext _dbContext;

    public CommunicationLogService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<CommunicationLog> CreateAsync(CreateCommunicationLogRequest request)
    {
        var log = new CommunicationLog
        {
            Type = request.Type.Trim(),
            Content = request.Content.Trim(),
            ConfidenceLevel = request.ConfidenceLevel,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            CreatedAt = request.CreatedAt?.ToLocalTime() ?? DateTime.Now
        };

        _dbContext.CommunicationLogs.Add(log);
        await _dbContext.SaveChangesAsync();

        return log;
    }

    public async Task<IReadOnlyList<CommunicationLog>> GetTodayAsync()
    {
        var today = DateTime.Today;

        return await _dbContext.CommunicationLogs
            .AsNoTracking()
            .Where(log => log.CreatedAt.Date == today)
            .OrderByDescending(log => log.CreatedAt)
            .ThenByDescending(log => log.Id)
            .ToListAsync();
    }

    public async Task<IReadOnlyList<CommunicationLog>> GetRecentAsync(int take = 20)
    {
        return await _dbContext.CommunicationLogs
            .AsNoTracking()
            .OrderByDescending(log => log.CreatedAt)
            .ThenByDescending(log => log.Id)
            .Take(take)
            .ToListAsync();
    }

    public CommunicationTodayResponse GetTodayPlan()
    {
        var today = DateTime.Today;
        var vocabulary = Vocabulary[(today.Year + today.DayOfYear) % Vocabulary.Count];
        var speakingPrompt = SpeakingPrompts[(today.DayOfYear * 3) % SpeakingPrompts.Count];
        var confidenceDrill = ConfidenceDrills[(today.DayOfYear * 5) % ConfidenceDrills.Count];

        return new CommunicationTodayResponse
        {
            Date = today.ToString("yyyy-MM-dd"),
            Word = vocabulary.Word,
            Meaning = vocabulary.Meaning,
            ExampleSentence = vocabulary.ExampleSentence,
            SpeakingPrompt = speakingPrompt,
            ConfidenceDrill = confidenceDrill
        };
    }
}
