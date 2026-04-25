namespace Jarvis.Api.Contracts;

public class MissionHistoryItemResponse
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public int XpReward { get; set; }

    public bool IsCompleted { get; set; }

    public string Category { get; set; } = string.Empty;
}
