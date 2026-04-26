using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class CreateMissionRequest
{
    [Required]
    [StringLength(120, MinimumLength = 2)]
    public string Title { get; set; } = string.Empty;

    [StringLength(360)]
    public string? Description { get; set; }

    [Range(1, 1000)]
    public int XpReward { get; set; }

    [Required]
    [StringLength(80, MinimumLength = 2)]
    public string Category { get; set; } = string.Empty;

    public DateTime? MissionDate { get; set; }
}
