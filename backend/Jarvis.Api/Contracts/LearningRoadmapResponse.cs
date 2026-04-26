namespace Jarvis.Api.Contracts;

public class LearningRoadmapResponse
{
    public IReadOnlyList<LearningRoadmapCategoryResponse> Categories { get; set; } = [];
}

public class LearningRoadmapCategoryResponse
{
    public string Name { get; set; } = string.Empty;

    public IReadOnlyList<LearningRoadmapTopicResponse> Topics { get; set; } = [];
}

public class LearningRoadmapTopicResponse
{
    public string Topic { get; set; } = string.Empty;

    public string Status { get; set; } = "NotStarted";

    public int ConfidenceLevel { get; set; } = 1;

    public DateTime? LastPracticedAt { get; set; }
}
