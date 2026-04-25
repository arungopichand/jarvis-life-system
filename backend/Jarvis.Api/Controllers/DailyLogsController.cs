using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/dailylog")]
public class DailyLogsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public DailyLogsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("today")]
    public async Task<ActionResult<DailyLog>> GetToday()
    {
        var dailyLog = await GetOrCreateTodayLogAsync();

        return Ok(dailyLog);
    }

    [HttpPost("update")]
    public async Task<ActionResult<DailyLog>> Update(UpdateDailyLogRequest request)
    {
        var dailyLog = await GetOrCreateTodayLogAsync();

        dailyLog.MorningCompleted = request.MorningCompleted;
        dailyLog.NightCompleted = request.NightCompleted;

        await _dbContext.SaveChangesAsync();

        return Ok(dailyLog);
    }

    private async Task<DailyLog> GetOrCreateTodayLogAsync()
    {
        var today = DateTime.Today;

        var dailyLog = await _dbContext.DailyLogs
            .FirstOrDefaultAsync(log => log.Date.Date == today);

        if (dailyLog is not null)
        {
            return dailyLog;
        }

        dailyLog = new DailyLog
        {
            Date = today,
            MorningCompleted = false,
            NightCompleted = false
        };

        _dbContext.DailyLogs.Add(dailyLog);
        await _dbContext.SaveChangesAsync();

        return dailyLog;
    }
}
