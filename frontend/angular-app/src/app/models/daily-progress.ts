export interface DailyProgressToday {
  date: string;
  completedMissionsCount: number;
  learningLoggedToday: boolean;
  communicationLoggedToday: boolean;
  diaryWrittenToday: boolean;
  incomeLoggedToday: boolean;
  checklistProgress?: number | null;
  dayCompletionScore: number;
  nextRecommendedAction: string;
}
