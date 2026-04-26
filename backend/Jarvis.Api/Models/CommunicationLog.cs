namespace Jarvis.Api.Models;

public class CommunicationLog
{
    public int Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public int ConfidenceLevel { get; set; }

    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
}
