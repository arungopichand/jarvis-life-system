namespace Jarvis.Api.Contracts;

public class DailyProgressTodayResponse
{
    public string Date { get; set; } = string.Empty;

    public int CompletedMissionsCount { get; set; }

    public bool LearningLoggedToday { get; set; }

    public bool CommunicationLoggedToday { get; set; }

    public bool DiaryWrittenToday { get; set; }

    public bool IncomeLoggedToday { get; set; }

    public int? ChecklistProgress { get; set; }

    public int DayCompletionScore { get; set; }

    public string NextRecommendedAction { get; set; } = string.Empty;
}
