using System.ComponentModel.DataAnnotations;

namespace Jarvis.Api.Contracts;

public class CreateExpenseRequest
{
    [Required]
    [StringLength(120, MinimumLength = 2)]
    public string Title { get; set; } = string.Empty;

    [Range(0.01, 1_000_000)]
    public decimal Amount { get; set; }

    [Required]
    [StringLength(80, MinimumLength = 2)]
    public string Category { get; set; } = string.Empty;

    public DateTime? ExpenseDate { get; set; }
}
