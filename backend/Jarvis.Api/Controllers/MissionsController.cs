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
            var defaultMissions = CreateDefaultMissionsForDate(today);

            _dbContext.Missions.AddRange(defaultMissions);
            await _dbContext.SaveChangesAsync();

            todayMissions = await _dbContext.Missions
                .Where(m => m.MissionDate.Date == today)
                .OrderBy(m => m.Id)
                .ToListAsync();
        }

        return Ok(todayMissions);
    }

    [HttpPost]
    public async Task<ActionResult<Mission>> Create(Mission mission)
    {
        if (mission.MissionDate == default)
        {
            mission.MissionDate = DateTime.Today;
        }

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

    private static List<Mission> CreateDefaultMissionsForDate(DateTime date)
    {
        return
        [
            new Mission
            {
                Title = "Gym",
                Description = "Complete your workout for today.",
                XpReward = 30,
                IsCompleted = false,
                MissionDate = date,
                Category = "Health"
            },
            new Mission
            {
                Title = "English Practice",
                Description = "Practice speaking, reading, or writing in English.",
                XpReward = 20,
                IsCompleted = false,
                MissionDate = date,
                Category = "Learning"
            },
            new Mission
            {
                Title = "Track Expenses",
                Description = "Record today's spending.",
                XpReward = 15,
                IsCompleted = false,
                MissionDate = date,
                Category = "Money"
            },
            new Mission
            {
                Title = "Learn .NET",
                Description = "Spend time learning .NET today.",
                XpReward = 30,
                IsCompleted = false,
                MissionDate = date,
                Category = "Technical Skills"
            },
            new Mission
            {
                Title = "Eat Protein",
                Description = "Make sure one meal today includes protein.",
                XpReward = 20,
                IsCompleted = false,
                MissionDate = date,
                Category = "Health"
            }
        ];
    }
}
