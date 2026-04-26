namespace Jarvis.Api.Models;

public class LearningLog
{
    public int Id { get; set; }

    public string Topic { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string? Notes { get; set; }

    public int Difficulty { get; set; }

    public DateTime? CompletedAt { get; set; }

    public DateTime CreatedAt { get; set; }
}
