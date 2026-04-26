using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/settings")]
public class UserSettingsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserSettingsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<UserSettings>> Get()
    {
        var settings = await GetOrCreateSettingsAsync();

        return Ok(settings);
    }

    [HttpPost]
    public async Task<ActionResult<UserSettings>> Update([FromBody] SaveUserSettingsRequest request)
    {
        var settings = await GetOrCreateSettingsAsync();

        settings.DailySpendingLimit = request.DailySpendingLimit;
        settings.MainSkill = request.MainSkill.Trim();
        settings.GymMinutesTarget = request.GymMinutesTarget;
        settings.ProteinGramsTarget = request.ProteinGramsTarget;

        await _dbContext.SaveChangesAsync();

        return Ok(settings);
    }

    private async Task<UserSettings> GetOrCreateSettingsAsync()
    {
        var settings = await _dbContext.UserSettings
            .OrderBy(setting => setting.Id)
            .FirstOrDefaultAsync();

        if (settings is not null)
        {
            return settings;
        }

        settings = new UserSettings
        {
            DailySpendingLimit = 500,
            MainSkill = ".NET",
            GymMinutesTarget = 45,
            ProteinGramsTarget = 80
        };

        _dbContext.UserSettings.Add(settings);
        await _dbContext.SaveChangesAsync();

        return settings;
    }
}
