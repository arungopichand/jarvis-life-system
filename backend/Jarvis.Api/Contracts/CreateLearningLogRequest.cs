using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class CreateLearningLogRequest
{
    [Required]
    [StringLength(140, MinimumLength = 2)]
    public string Topic { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(CSharp|DotNet|AspNetCore|Sql|Angular|TypeScript|SystemDesign|GitHub)$")]
    public string Category { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Notes { get; set; }

    [Range(1, 5)]
    public int Difficulty { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime? CreatedAt { get; set; }
}
