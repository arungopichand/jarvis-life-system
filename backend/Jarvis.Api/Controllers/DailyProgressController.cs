using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/daily-progress")]
public class DailyProgressController : ControllerBase
{
    private readonly DailyProgressService _dailyProgressService;

    public DailyProgressController(DailyProgressService dailyProgressService)
    {
        _dailyProgressService = dailyProgressService;
    }

    [HttpGet("today")]
    public async Task<ActionResult<DailyProgressTodayResponse>> GetToday()
    {
        var response = await _dailyProgressService.GetTodayAsync();
        return Ok(response);
    }
}
