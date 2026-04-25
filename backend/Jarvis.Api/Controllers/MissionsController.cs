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
}
