using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/diary")]
public class DiaryController : ControllerBase
{
    private readonly DiaryService _diaryService;

    public DiaryController(DiaryService diaryService)
    {
        _diaryService = diaryService;
    }

    [HttpPost]
    public async Task<ActionResult<DiaryEntry>> Create([FromBody] CreateDiaryEntryRequest request)
    {
        var created = await _diaryService.CreateAsync(request);
        return Ok(created);
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<DiaryEntry>>> GetRecent()
    {
        var recent = await _diaryService.GetRecentAsync();
        return Ok(recent);
    }
}
