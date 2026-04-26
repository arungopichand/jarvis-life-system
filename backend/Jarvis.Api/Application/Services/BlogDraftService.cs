using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Application.Services;

public class BlogDraftService
{
    private readonly AppDbContext _dbContext;

    public BlogDraftService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<BlogDraft> CreateAsync(CreateBlogDraftRequest request)
    {
        var now = DateTime.Now;

        var draft = new BlogDraft
        {
            Title = request.Title.Trim(),
            Topic = request.Topic.Trim(),
            Content = request.Content.Trim(),
            Status = request.Status.Trim(),
            CreatedAt = now,
            UpdatedAt = now
        };

        _dbContext.BlogDrafts.Add(draft);
        await _dbContext.SaveChangesAsync();
        return draft;
    }

    public async Task<IReadOnlyList<BlogDraft>> GetRecentAsync(int take = 20)
    {
        return await _dbContext.BlogDrafts
            .AsNoTracking()
            .OrderByDescending(draft => draft.UpdatedAt)
            .ThenByDescending(draft => draft.Id)
            .Take(take)
            .ToListAsync();
    }

    public async Task<BlogDraft?> UpdateAsync(int id, UpdateBlogDraftRequest request)
    {
        var draft = await _dbContext.BlogDrafts.FirstOrDefaultAsync(item => item.Id == id);

        if (draft is null)
        {
            return null;
        }

        if (!string.IsNullOrWhiteSpace(request.Title))
        {
            draft.Title = request.Title.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Topic))
        {
            draft.Topic = request.Topic.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Content))
        {
            draft.Content = request.Content.Trim();
        }

        if (!string.IsNullOrWhiteSpace(request.Status))
        {
            draft.Status = request.Status.Trim();
        }

        draft.UpdatedAt = DateTime.Now;

        await _dbContext.SaveChangesAsync();
        return draft;
    }
}
