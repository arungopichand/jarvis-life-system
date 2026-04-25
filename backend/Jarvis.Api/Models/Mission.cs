namespace Jarvis.Api.Models;

public class Mission
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int XpReward { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime MissionDate { get; set; }

    public string Category { get; set; } = string.Empty;
}
