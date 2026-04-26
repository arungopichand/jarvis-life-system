using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Application.Services;

public class DiaryService
{
    private readonly AppDbContext _dbContext;

    public DiaryService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<DiaryEntry> CreateAsync(CreateDiaryEntryRequest request)
    {
        var entry = new DiaryEntry
        {
            Mood = request.Mood.Trim(),
            Content = request.Content.Trim(),
            ReflectionPrompt = string.IsNullOrWhiteSpace(request.ReflectionPrompt)
                ? string.Empty
                : request.ReflectionPrompt.Trim(),
            CreatedAt = request.CreatedAt?.ToLocalTime() ?? DateTime.Now
        };

        _dbContext.DiaryEntries.Add(entry);
        await _dbContext.SaveChangesAsync();
        return entry;
    }

    public async Task<IReadOnlyList<DiaryEntry>> GetRecentAsync(int take = 20)
    {
        return await _dbContext.DiaryEntries
            .AsNoTracking()
            .OrderByDescending(entry => entry.CreatedAt)
            .ThenByDescending(entry => entry.Id)
            .Take(take)
            .ToListAsync();
    }
}
