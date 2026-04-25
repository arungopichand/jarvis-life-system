namespace Jarvis.Api.Contracts;

public class WeeklyStatsResponse
{
    public string Date { get; set; } = string.Empty;

    public int TotalMissions { get; set; }

    public int CompletedMissions { get; set; }

    public int CompletionPercentage { get; set; }

    public decimal TotalSpent { get; set; }
}
