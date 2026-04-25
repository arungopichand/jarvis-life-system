namespace Jarvis.Api.Contracts;

public class MissionHistoryDayResponse
{
    public string Date { get; set; } = string.Empty;

    public int TotalMissions { get; set; }

    public int CompletedMissions { get; set; }

    public int CompletionPercentage { get; set; }

    public List<MissionHistoryItemResponse> Missions { get; set; } = [];
}
