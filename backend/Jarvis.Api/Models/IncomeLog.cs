namespace Jarvis.Api.Models;

public class IncomeLog
{
    public int Id { get; set; }

    public string Source { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
}
