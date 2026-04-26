namespace Jarvis.Api.Models;

public class BlogDraft
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Topic { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public string Status { get; set; } = "Draft";

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
