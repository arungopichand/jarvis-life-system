namespace Jarvis.Api.Contracts;

public class CommunicationTodayResponse
{
    public string Date { get; set; } = string.Empty;

    public string Word { get; set; } = string.Empty;

    public string Meaning { get; set; } = string.Empty;

    public string ExampleSentence { get; set; } = string.Empty;

    public string SpeakingPrompt { get; set; } = string.Empty;

    public string ConfidenceDrill { get; set; } = string.Empty;
}
