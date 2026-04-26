namespace Jarvis.Api.Contracts;

public class IncomeMonthSummaryResponse
{
    public int Year { get; set; }

    public int Month { get; set; }

    public decimal TotalIncome { get; set; }

    public int EntriesCount { get; set; }

    public decimal MonthlyIncomeGoal { get; set; }

    public decimal SavingsGoal { get; set; }

    public decimal GoalProgressPercentage { get; set; }
}
