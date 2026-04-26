using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/income")]
public class IncomeController : ControllerBase
{
    private readonly IncomeService _incomeService;

    public IncomeController(IncomeService incomeService)
    {
        _incomeService = incomeService;
    }

    [HttpPost]
    public async Task<ActionResult<IncomeLog>> Create([FromBody] CreateIncomeLogRequest request)
    {
        var created = await _incomeService.CreateAsync(request);
        return Ok(created);
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<IncomeLog>>> GetRecent()
    {
        var recent = await _incomeService.GetRecentAsync();
        return Ok(recent);
    }

    [HttpGet("month-summary")]
    public async Task<ActionResult<IncomeMonthSummaryResponse>> GetMonthSummary()
    {
        var summary = await _incomeService.GetCurrentMonthSummaryAsync();
        return Ok(summary);
    }
}
