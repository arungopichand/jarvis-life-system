namespace Jarvis.Api.Contracts;

public class LearningTodayResponse
{
    public string Date { get; set; } = string.Empty;

    public string Topic { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public string PracticePrompt { get; set; } = string.Empty;

    public int TodayLogCount { get; set; }
}
