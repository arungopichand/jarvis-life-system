using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/blog-drafts")]
public class BlogDraftsController : ControllerBase
{
    private readonly BlogDraftService _blogDraftService;

    public BlogDraftsController(BlogDraftService blogDraftService)
    {
        _blogDraftService = blogDraftService;
    }

    [HttpPost]
    public async Task<ActionResult<BlogDraft>> Create([FromBody] CreateBlogDraftRequest request)
    {
        var created = await _blogDraftService.CreateAsync(request);
        return Ok(created);
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<BlogDraft>>> GetRecent()
    {
        var recent = await _blogDraftService.GetRecentAsync();
        return Ok(recent);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<BlogDraft>> Update(int id, [FromBody] UpdateBlogDraftRequest request)
    {
        var updated = await _blogDraftService.UpdateAsync(id, request);

        if (updated is null)
        {
            return NotFound();
        }

        return Ok(updated);
    }
}
