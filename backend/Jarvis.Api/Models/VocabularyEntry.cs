namespace Jarvis.Api.Models;

public class VocabularyEntry
{
    public int Id { get; set; }

    public string Word { get; set; } = string.Empty;

    public string Meaning { get; set; } = string.Empty;

    public string ExampleSentence { get; set; } = string.Empty;
}
