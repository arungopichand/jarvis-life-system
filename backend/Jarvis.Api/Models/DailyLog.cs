namespace Jarvis.Api.Models;

public class DailyLog
{
    public int Id { get; set; }

    public DateTime Date { get; set; }

    public bool MorningCompleted { get; set; }

    public bool NightCompleted { get; set; }
}
