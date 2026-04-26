using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class UpdateLearningTopicProgressRequest
{
    [Required]
    [StringLength(140, MinimumLength = 2)]
    public string Topic { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(CSharp|DotNet|AspNetCore|Sql|Angular|TypeScript|SystemDesign|GitHub)$")]
    public string Category { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(NotStarted|InProgress|Completed)$")]
    public string Status { get; set; } = "NotStarted";

    [Range(1, 5)]
    public int ConfidenceLevel { get; set; } = 1;

    public DateTime? LastPracticedAt { get; set; }
}
