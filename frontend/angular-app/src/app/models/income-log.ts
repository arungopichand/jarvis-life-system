export interface IncomeLog {
  id: number;
  source: string;
  amount: number;
  notes?: string | null;
  createdAt: string;
}

export interface IncomeMonthSummary {
  year: number;
  month: number;
  totalIncome: number;
  entriesCount: number;
  monthlyIncomeGoal: number;
  savingsGoal: number;
  goalProgressPercentage: number;
}
