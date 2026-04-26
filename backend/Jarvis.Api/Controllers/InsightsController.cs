using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InsightsController : ControllerBase
{
    private readonly LifeOsInsightsService _insightsService;

    public InsightsController(LifeOsInsightsService insightsService)
    {
        _insightsService = insightsService;
    }

    [HttpGet("today")]
    public async Task<ActionResult<LifeOsInsightsResponse>> GetToday()
    {
        var response = await _insightsService.BuildTodayInsightsAsync();
        return Ok(response);
    }
}
