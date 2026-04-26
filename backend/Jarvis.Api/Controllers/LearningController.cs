using Jarvis.Api.Application.Services;
using Jarvis.Api.Contracts;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/learning")]
public class LearningController : ControllerBase
{
    private readonly LearningLogService _learningLogService;

    public LearningController(LearningLogService learningLogService)
    {
        _learningLogService = learningLogService;
    }

    [HttpGet("today")]
    public async Task<ActionResult<LearningTodayResponse>> GetToday()
    {
        var todayPlan = await _learningLogService.GetTodayPlanAsync();
        return Ok(todayPlan);
    }

    [HttpGet("roadmap")]
    public async Task<ActionResult<LearningRoadmapResponse>> GetRoadmap()
    {
        var roadmap = await _learningLogService.GetRoadmapAsync();
        return Ok(roadmap);
    }

    [HttpPost("log")]
    public async Task<ActionResult<LearningLog>> CreateLog([FromBody] CreateLearningLogRequest request)
    {
        var log = await _learningLogService.CreateAsync(request);
        return Ok(log);
    }

    [HttpPatch("topic-progress")]
    public async Task<ActionResult<LearningTopicProgress>> UpdateTopicProgress([FromBody] UpdateLearningTopicProgressRequest request)
    {
        var updated = await _learningLogService.UpsertTopicProgressAsync(request);
        return Ok(updated);
    }

    [HttpGet("recent")]
    public async Task<ActionResult<IEnumerable<LearningLog>>> GetRecent()
    {
        var logs = await _learningLogService.GetRecentAsync();
        return Ok(logs);
    }
}
