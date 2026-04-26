using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class CreateCommunicationLogRequest
{
    [Required]
    [RegularExpression("^(Vocabulary|Speaking|Conversation|Interview|Writing)$")]
    public string Type { get; set; } = string.Empty;

    [Required]
    [StringLength(500, MinimumLength = 2)]
    public string Content { get; set; } = string.Empty;

    [Range(1, 5)]
    public int ConfidenceLevel { get; set; }

    [StringLength(300)]
    public string? Notes { get; set; }

    public DateTime? CreatedAt { get; set; }
}
