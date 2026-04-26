namespace Jarvis.Api.Models;

public class LearningTopicProgress
{
    public int Id { get; set; }

    public string Topic { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string Status { get; set; } = "NotStarted";

    public int ConfidenceLevel { get; set; } = 1;

    public DateTime? LastPracticedAt { get; set; }
}
