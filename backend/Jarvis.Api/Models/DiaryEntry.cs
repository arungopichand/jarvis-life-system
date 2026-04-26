namespace Jarvis.Api.Models;

public class DiaryEntry
{
    public int Id { get; set; }

    public string Mood { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string ReflectionPrompt { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }
}
