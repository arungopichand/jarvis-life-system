using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class CreateDiaryEntryRequest
{
    [Required]
    [StringLength(40, MinimumLength = 2)]
    public string Mood { get; set; } = string.Empty;

    [Required]
    [StringLength(4000, MinimumLength = 5)]
    public string Content { get; set; } = string.Empty;

    [StringLength(500)]
    public string ReflectionPrompt { get; set; } = string.Empty;

    public DateTime? CreatedAt { get; set; }
}
