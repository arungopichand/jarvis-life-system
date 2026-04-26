namespace Jarvis.Api.Contracts;

public class LifeOsInsightsResponse
{
    public string Date { get; set; } = string.Empty;

    public int DisciplineScore { get; set; }

    public int FinancialDisciplineScore { get; set; }

    public string ExecutiveSummary { get; set; } = string.Empty;

    public string FinanceInsight { get; set; } = string.Empty;

    public string LearningInsight { get; set; } = string.Empty;

    public string CommunicationInsight { get; set; } = string.Empty;

    public string HealthInsight { get; set; } = string.Empty;

    public string FocusInsight { get; set; } = string.Empty;

    public IReadOnlyList<string> RecommendedActions { get; set; } = [];
}
