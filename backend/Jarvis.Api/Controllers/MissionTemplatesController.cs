using Jarvis.Api.Contracts;
using Jarvis.Api.Data;
using Jarvis.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Jarvis.Api.Controllers;

[ApiController]
[Route("api/mission-templates")]
public class MissionTemplatesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public MissionTemplatesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MissionTemplate>>> GetAll()
    {
        var templates = await _dbContext.MissionTemplates
            .OrderBy(template => template.Id)
            .ToListAsync();

        return Ok(templates);
    }

    [HttpPost]
    public async Task<ActionResult<MissionTemplate>> Create([FromBody] SaveMissionTemplateRequest request)
    {
        var template = new MissionTemplate
        {
            Title = request.Title.Trim(),
            Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim(),
            XpReward = request.XpReward,
            Category = request.Category.Trim(),
            IsEnabled = request.IsEnabled
        };

        _dbContext.MissionTemplates.Add(template);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = template.Id }, template);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<MissionTemplate>> Update(int id, [FromBody] SaveMissionTemplateRequest request)
    {
        var template = await _dbContext.MissionTemplates.FirstOrDefaultAsync(item => item.Id == id);

        if (template is null)
        {
            return NotFound();
        }

        template.Title = request.Title.Trim();
        template.Description = string.IsNullOrWhiteSpace(request.Description) ? null : request.Description.Trim();
        template.XpReward = request.XpReward;
        template.Category = request.Category.Trim();
        template.IsEnabled = request.IsEnabled;

        await _dbContext.SaveChangesAsync();

        return Ok(template);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var template = await _dbContext.MissionTemplates.FirstOrDefaultAsync(item => item.Id == id);

        if (template is null)
        {
            return NotFound();
        }

        _dbContext.MissionTemplates.Remove(template);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}
