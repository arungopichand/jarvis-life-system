namespace Jarvis.Api.Models;

public class UserSettings
{
    public int Id { get; set; }

    public decimal DailySpendingLimit { get; set; }

    public string MainSkill { get; set; } = string.Empty;

    public int GymMinutesTarget { get; set; }

    public int ProteinGramsTarget { get; set; }
}
