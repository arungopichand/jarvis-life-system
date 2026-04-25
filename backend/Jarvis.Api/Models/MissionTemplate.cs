namespace Jarvis.Api.Models;

public class MissionTemplate
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int XpReward { get; set; }

    public string Category { get; set; } = string.Empty;

    public bool IsEnabled { get; set; }
}
