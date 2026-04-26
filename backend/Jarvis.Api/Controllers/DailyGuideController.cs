using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/daily-guide")]
public class DailyGuideController : ControllerBase
{
    private readonly DailyGuideService _dailyGuideService;

    public DailyGuideController(DailyGuideService dailyGuideService)
    {
        _dailyGuideService = dailyGuideService;
    }

    [HttpGet("today")]
    public ActionResult<DailyGuideResponse> GetToday()
    {
        var response = _dailyGuideService.BuildTodayGuide();
        return Ok(response);
    }
}
