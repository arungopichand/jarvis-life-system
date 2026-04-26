using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MissionsController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public MissionsController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Mission>>> GetAll()
    {
        var missions = await _dbContext.Missions
            .OrderBy(m => m.MissionDate)
            .ThenBy(m => m.Id)
            .ToListAsync();

        return Ok(missions);
    }

    [HttpGet("today")]
    public async Task<ActionResult<IEnumerable<Mission>>> GetToday()
    {
        var today = DateTime.Today;

        var todayMissions = await _dbContext.Missions
            .Where(m => m.MissionDate.Date == today)
            .OrderBy(m => m.Id)
            .ToListAsync();

        if (todayMissions.Count == 0)
        {
            var missionTemplates = await _dbContext.MissionTemplates
                .Where(template => template.IsEnabled)
                .OrderBy(template => template.Id)
                .ToListAsync();

            var missionsFromTemplates = missionTemplates
                .Select(template => new Mission
                {
                    Title = template.Title,
                    Description = template.Description,
                    XpReward = template.XpReward,
                    IsCompleted = false,
                    MissionDate = today,
                    Category = template.Category
                })
                .ToList();

            _dbContext.Missions.AddRange(missionsFromTemplates);
            await _dbContext.SaveChangesAsync();

            todayMissions = await _dbContext.Missions
                .Where(m => m.MissionDate.Date == today)
                .OrderBy(m => m.Id)
                .ToListAsync();
        }

        return Ok(todayMissions);
    }

    [HttpGet("history")]
    public async Task<ActionResult<IEnumerable<MissionHistoryDayResponse>>> GetHistory([FromQuery] int days = 30)
    {
        if (days <= 0)
        {
            days = 30;
        }

        var endDate = DateTime.Today;
        var startDate = endDate.AddDays(-(days - 1));

        var missions = await _dbContext.Missions
            .AsNoTracking()
            .Where(m => m.MissionDate.Date >= startDate && m.MissionDate.Date <= endDate)
            .OrderBy(m => m.MissionDate)
            .ThenBy(m => m.Id)
            .ToListAsync();

        var history = new List<MissionHistoryDayResponse>();

        for (var date = startDate; date <= endDate; date = date.AddDays(1))
        {
            var dailyMissions = missions
                .Where(m => m.MissionDate.Date == date)
                .Select(mission => new MissionHistoryItemResponse
                {
                    Id = mission.Id,
                    Title = mission.Title,
                    XpReward = mission.XpReward,
                    IsCompleted = mission.IsCompleted,
                    Category = mission.Category
                })
                .ToList();

            var totalMissions = dailyMissions.Count;
            var completedMissions = dailyMissions.Count(mission => mission.IsCompleted);

            history.Add(new MissionHistoryDayResponse
            {
                Date = date.ToString("yyyy-MM-dd"),
                TotalMissions = totalMissions,
                CompletedMissions = completedMissions,
                CompletionPercentage = GetCompletionPercentage(totalMissions, completedMissions),
                Missions = dailyMissions
            });
        }

        return Ok(history);
    }

    [HttpPost]
    public async Task<ActionResult<Mission>> Create([FromBody] CreateMissionRequest request)
    {
        var mission = new Mission
        {
            Title = request.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            XpReward = request.XpReward,
            IsCompleted = false,
            MissionDate = request.MissionDate?.Date ?? DateTime.Today,
            Category = request.Category.Trim()
        };

        _dbContext.Missions.Add(mission);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = mission.Id }, mission);
    }

    [HttpPut("{id}/complete")]
    public async Task<ActionResult<Mission>> Complete(int id)
    {
        var mission = await _dbContext.Missions.FirstOrDefaultAsync(m => m.Id == id);

        if (mission is null)
        {
            return NotFound();
        }

        mission.IsCompleted = true;
        await _dbContext.SaveChangesAsync();

        return Ok(mission);
    }

    private static int GetCompletionPercentage(int totalMissions, int completedMissions)
    {
        if (totalMissions == 0)
        {
            return 0;
        }

        return (int)Math.Round((double)completedMissions / totalMissions * 100);
    }
}
