using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class SaveUserSettingsRequest
{
    [Range(0, 1_000_000)]
    public decimal DailySpendingLimit { get; set; }

    [Required]
    [StringLength(80, MinimumLength = 2)]
    public string MainSkill { get; set; } = string.Empty;

    [Range(0, 600)]
    public int GymMinutesTarget { get; set; }

    [Range(0, 500)]
    public int ProteinGramsTarget { get; set; }
}
