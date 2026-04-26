using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class CreateIncomeLogRequest
{
    [Required]
    [StringLength(120, MinimumLength = 2)]
    public string Source { get; set; } = string.Empty;

    [Range(0.01, 10_000_000)]
    public decimal Amount { get; set; }

    [StringLength(300)]
    public string? Notes { get; set; }

    public DateTime? CreatedAt { get; set; }
}
