using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/communication")]
public class CommunicationController : ControllerBase
{
    private readonly CommunicationLogService _communicationLogService;

    public CommunicationController(CommunicationLogService communicationLogService)
    {
        _communicationLogService = communicationLogService;
    }

    [HttpPost("log")]
    public async Task<ActionResult<CommunicationLog>> CreateLog([FromBody] CreateCommunicationLogRequest request)
    {
        var log = await _communicationLogService.CreateAsync(request);
        return Ok(log);
    }

    [HttpGet("today")]
    public ActionResult<CommunicationTodayResponse> GetToday()
    {
        var response = _communicationLogService.GetTodayPlan();
        return Ok(response);
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<CommunicationLog>>> GetRecent()
    {
        var logs = await _communicationLogService.GetRecentAsync();
        return Ok(logs);
    }
}
