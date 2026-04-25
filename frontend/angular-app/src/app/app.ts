import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Expense } from './models/expense';
import { DailyLog } from './models/daily-log';
import { Mission } from './models/mission';
import { StreakStats } from './models/streak-stats';
import { UserSettings } from './models/user-settings';
import { WeeklyStats } from './models/weekly-stats';
import { DailyLogService } from './services/daily-log.service';
import { ExpenseService } from './services/expense.service';
import { MissionService } from './services/mission.service';
import { SettingsService } from './services/settings.service';
import { StatsService } from './services/stats.service';

type ChatMessage = {
  sender: 'user' | 'assistant';
  text: string;
};

type ChecklistItem = {
  label: string;
  completed: boolean;
};

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  // Training Room
  private readonly englishPrompts = [
    'Speak for 2 minutes about your day.',
    'Describe one goal you want to achieve this week.',
    'Explain your favorite movie in simple English.'
  ];
  private readonly confidencePrompts = [
    'Say hi to one person today.',
    'Ask one clear question with confidence.',
    'Stand tall and introduce yourself first.'
  ];
  private readonly typingPrompts = [
    'Type one paragraph without looking at the keyboard.',
    'Type for 3 minutes and focus on accuracy first.',
    'Rewrite a short quote without stopping.'
  ];

  // Dashboard state
  title = 'JARVIS Life System';
  missions: Mission[] = [];
  expenses: Expense[] = [];
  isLoading = true;
  errorMessage = '';
  financeErrorMessage = '';
  dailyLogErrorMessage = '';
  settingsErrorMessage = '';
  settingsSuccessMessage = '';
  streakStatsErrorMessage = '';
  weeklyStatsErrorMessage = '';
  nextActionMessage = '';
  dailyLog: DailyLog | null = null;
  userSettings: UserSettings = {
    id: 0,
    dailySpendingLimit: 500,
    mainSkill: '.NET',
    gymMinutesTarget: 45,
    proteinGramsTarget: 80
  };
  streakStats: StreakStats = {
    currentStreak: 0,
    longestStreak: 0
  };
  weeklyStats: WeeklyStats[] = [];
  englishPromptIndex = 0;
  confidencePromptIndex = 0;
  typingPromptIndex = 0;
  assistantMessage = '';
  chatHistory: ChatMessage[] = [
    {
      sender: 'assistant',
      text: 'Systems ready. Tell me what is blocking you, and I will suggest the next action.'
    }
  ];
  morningChecklist: ChecklistItem[] = [
    { label: 'Open dashboard', completed: false },
    { label: 'Check Focus Now', completed: false },
    { label: 'Start first mission', completed: false }
  ];
  nightChecklist: ChecklistItem[] = [
    { label: 'Track expenses', completed: false },
    { label: 'Review weekly progress', completed: false },
    { label: 'Ask JARVIS one question', completed: false }
  ];
  expenseForm = {
    title: '',
    amount: null as number | null,
    category: ''
  };

  constructor(
    private dailyLogService: DailyLogService,
    private missionService: MissionService,
    private expenseService: ExpenseService,
    private settingsService: SettingsService,
    private statsService: StatsService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadTodayDailyLog();
    this.loadTodayMissions();
    this.loadTodayExpenses();
    this.loadStreakStats();
    this.loadWeeklyStats();
  }

  loadSettings(): void {
    this.settingsErrorMessage = '';
    this.settingsSuccessMessage = '';

    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.userSettings = settings;
      },
      error: () => {
        this.settingsErrorMessage = 'Could not load user settings.';
      }
    });
  }

  loadTodayDailyLog(): void {
    this.dailyLogErrorMessage = '';

    this.dailyLogService.getTodayLog().subscribe({
      next: (dailyLog) => {
        this.dailyLog = dailyLog;
        this.applyDailyLogToChecklist();
      },
      error: () => {
        this.dailyLogErrorMessage = 'Could not load today\'s checklist status.';
      }
    });
  }

  // Missions
  loadTodayMissions(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.missionService.getTodayMissions().subscribe({
      next: (missions) => {
        this.missions = missions;
        this.refreshGuidance();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load today\'s missions.';
        this.isLoading = false;
      }
    });
  }

  completeMission(id: number): void {
    this.errorMessage = '';

    this.missionService.completeMission(id).subscribe({
      next: (updatedMission) => {
        this.missions = this.missions.map((mission) =>
          mission.id === id ? updatedMission : mission
        );
        this.refreshGuidance();
        this.loadStreakStats();
        this.loadWeeklyStats();
      },
      error: () => {
        this.errorMessage = 'Could not complete the mission.';
      }
    });
  }

  resetDay(): void {
    this.missions = this.missions.map((mission) => ({
      ...mission,
      isCompleted: false
    }));

    this.refreshGuidance();
  }

  loadStreakStats(): void {
    this.streakStatsErrorMessage = '';

    this.statsService.getStreakStats().subscribe({
      next: (stats) => {
        this.streakStats = stats;
      },
      error: () => {
        this.streakStatsErrorMessage = 'Could not load streak stats.';
      }
    });
  }

  loadWeeklyStats(): void {
    this.weeklyStatsErrorMessage = '';

    this.statsService.getWeeklyStats().subscribe({
      next: (stats) => {
        this.weeklyStats = stats;
      },
      error: () => {
        this.weeklyStatsErrorMessage = 'Could not load weekly stats.';
      }
    });
  }

  // Expenses
  loadTodayExpenses(): void {
    this.financeErrorMessage = '';

    this.expenseService.getTodayExpenses().subscribe({
      next: (expenses) => {
        this.expenses = expenses;
        this.refreshGuidance();
      },
      error: () => {
        this.financeErrorMessage = 'Could not load today\'s expenses.';
      }
    });
  }

  addExpense(): void {
    if (!this.isExpenseFormValid()) {
      this.financeErrorMessage = 'Please fill in title, amount, and category.';
      return;
    }

    this.financeErrorMessage = '';
    const amount = this.expenseForm.amount;

    if (amount === null) {
      return;
    }

    const expenseToCreate: Expense = {
      id: 0,
      title: this.expenseForm.title.trim(),
      amount,
      category: this.expenseForm.category.trim(),
      expenseDate: new Date().toISOString()
    };

    this.expenseService.createExpense(expenseToCreate).subscribe({
      next: () => {
        this.clearExpenseForm();
        this.loadTodayExpenses();
        this.loadWeeklyStats();
      },
      error: () => {
        this.financeErrorMessage = 'Could not add the expense.';
      }
    });
  }

  removeExpense(id: number): void {
    this.financeErrorMessage = '';

    const confirmed = window.confirm('Delete this expense?');

    if (!confirmed) {
      return;
    }

    this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.loadTodayExpenses();
        this.loadWeeklyStats();
      },
      error: () => {
        this.financeErrorMessage = 'Could not delete the expense.';
      }
    });
  }

  private isExpenseFormValid(): boolean {
    return Boolean(
      this.expenseForm.title.trim() &&
      this.expenseForm.amount !== null &&
      this.expenseForm.category.trim()
    );
  }

  clearExpenseForm(): void {
    this.expenseForm = {
      title: '',
      amount: null,
      category: ''
    };
  }

  // Guidance
  refreshGuidance(): void {
    const completedMissionCount = this.completedMissionsToday;
    const totalMissionCount = this.missions.length;
    const trackExpensesMission = this.missions.find((mission) => mission.title === 'Track Expenses');
    const hasCompletedExpenseTracking = trackExpensesMission?.isCompleted ?? false;

    if (this.totalSpentToday > 500) {
      this.nextActionMessage = 'Spending alert. Review today\'s expenses before buying anything else.';
      return;
    }

    if (this.totalSpentToday > 0 && !hasCompletedExpenseTracking) {
      this.nextActionMessage = 'You spent money today. Complete Track Expenses now.';
      return;
    }

    if (completedMissionCount === 0) {
      this.nextActionMessage = 'Start with the easiest mission. Do 5 minutes only.';
      return;
    }

    if (totalMissionCount > 0 && completedMissionCount < totalMissionCount) {
      this.nextActionMessage = 'Good progress. Complete one more mission now.';
      return;
    }

    if (totalMissionCount > 0 && completedMissionCount === totalMissionCount) {
      this.nextActionMessage = 'Excellent. Daily mission complete. Review your expenses and rest.';
      return;
    }

    this.nextActionMessage = 'Start with the easiest mission. Do 5 minutes only.';
  }

  // Weekly Review
  get todayXpEarned(): number {
    return this.missions
      .filter((mission) => mission.isCompleted)
      .reduce((total, mission) => total + mission.xpReward, 0);
  }

  get totalPossibleXp(): number {
    return this.missions.reduce((total, mission) => total + mission.xpReward, 0);
  }

  get dailyCompletionPercentage(): number {
    if (this.missions.length === 0) {
      return 0;
    }

    return Math.round((this.completedMissionsToday / this.missions.length) * 100);
  }

  get currentLevel(): number {
    const xp = this.todayXpEarned;

    if (xp >= 500) {
      return 4;
    }

    if (xp >= 250) {
      return 3;
    }

    if (xp >= 100) {
      return 2;
    }

    return 1;
  }

  get totalSpentToday(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  }

  get focusMissionId(): number | null {
    if (this.totalSpentToday > 0) {
      const trackExpensesMission = this.missions.find((mission) => mission.title === 'Track Expenses');

      if (trackExpensesMission && !trackExpensesMission.isCompleted) {
        return trackExpensesMission.id;
      }
    }

    const firstIncompleteMission = this.missions.find((mission) => !mission.isCompleted);

    return firstIncompleteMission?.id ?? null;
  }

  get completedMissionsToday(): number {
    return this.missions.filter((mission) => mission.isCompleted).length;
  }

  get totalCompletedMissionsThisWeek(): number {
    return this.weeklyStats.reduce((total, day) => total + day.completedMissions, 0);
  }

  get averageCompletionPercentageThisWeek(): number {
    if (this.weeklyStats.length === 0) {
      return 0;
    }

    const totalPercentage = this.weeklyStats.reduce((total, day) => total + day.completionPercentage, 0);

    return Math.round(totalPercentage / this.weeklyStats.length);
  }

  get totalSpentThisWeek(): number {
    return this.weeklyStats.reduce((total, day) => total + day.totalSpent, 0);
  }

  get streakRewardMessage(): string {
    if (this.streakStats.currentStreak === 0) {
      return 'Start your streak today.';
    }

    if (this.streakStats.currentStreak <= 2) {
      return 'Good start. Keep going.';
    }

    if (this.streakStats.currentStreak <= 6) {
      return 'Momentum building.';
    }

    return 'Discipline mode activated.';
  }

  // Training Room
  get currentEnglishPrompt(): string {
    return this.englishPrompts[this.englishPromptIndex];
  }

  get currentConfidencePrompt(): string {
    return this.confidencePrompts[this.confidencePromptIndex];
  }

  get currentTypingPrompt(): string {
    return this.typingPrompts[this.typingPromptIndex];
  }

  showNextEnglishPrompt(): void {
    this.englishPromptIndex = (this.englishPromptIndex + 1) % this.englishPrompts.length;
  }

  showNextConfidencePrompt(): void {
    this.confidencePromptIndex = (this.confidencePromptIndex + 1) % this.confidencePrompts.length;
  }

  showNextTypingPrompt(): void {
    this.typingPromptIndex = (this.typingPromptIndex + 1) % this.typingPrompts.length;
  }

  saveSettings(): void {
    this.settingsErrorMessage = '';
    this.settingsSuccessMessage = '';

    this.settingsService.saveSettings(this.userSettings).subscribe({
      next: (settings) => {
        this.userSettings = settings;
        this.settingsSuccessMessage = 'Settings saved.';
      },
      error: () => {
        this.settingsErrorMessage = 'Could not save user settings.';
      }
    });
  }

  onMorningChecklistChange(): void {
    this.updateDailyLogFromChecklist();
  }

  onNightChecklistChange(): void {
    this.updateDailyLogFromChecklist();
  }

  // JARVIS Assistant
  sendAssistantMessage(): void {
    const userMessage = this.assistantMessage.trim();

    if (!userMessage) {
      return;
    }

    this.chatHistory.push({
      sender: 'user',
      text: userMessage
    });

    this.chatHistory.push({
      sender: 'assistant',
      text: this.getAssistantReply(userMessage)
    });

    this.assistantMessage = '';
  }

  private getAssistantReply(message: string): string {
    const normalizedMessage = message.toLowerCase();

    if (normalizedMessage.includes('lazy') || normalizedMessage.includes('procrastinate')) {
      return 'Do 5 minutes only. Start with your Focus Now mission.';
    }

    if (normalizedMessage.includes('money') || normalizedMessage.includes('spend')) {
      return 'Open Finance Lab and enter today\'s expenses before buying anything else.';
    }

    if (normalizedMessage.includes('english')) {
      return 'Go to Training Room and speak for 2 minutes about your day.';
    }

    if (normalizedMessage.includes('gym')) {
      return 'Do not think. Wear your shoes and go for 10 minutes.';
    }

    return 'Your next best action is to complete one mission now.';
  }

  private applyDailyLogToChecklist(): void {
    const morningCompleted = this.dailyLog?.morningCompleted ?? false;
    const nightCompleted = this.dailyLog?.nightCompleted ?? false;

    this.setChecklistCompletion(this.morningChecklist, morningCompleted);
    this.setChecklistCompletion(this.nightChecklist, nightCompleted);
  }

  private updateDailyLogFromChecklist(): void {
    const morningCompleted = this.areAllChecklistItemsCompleted(this.morningChecklist);
    const nightCompleted = this.areAllChecklistItemsCompleted(this.nightChecklist);

    this.dailyLogErrorMessage = '';

    this.dailyLogService.updateDailyLog(morningCompleted, nightCompleted).subscribe({
      next: (dailyLog) => {
        this.dailyLog = dailyLog;
      },
      error: () => {
        this.dailyLogErrorMessage = 'Could not save today\'s checklist status.';
      }
    });
  }

  private areAllChecklistItemsCompleted(items: ChecklistItem[]): boolean {
    return items.every((item) => item.completed);
  }

  private setChecklistCompletion(items: ChecklistItem[], completed: boolean): void {
    items.forEach((item) => {
      item.completed = completed;
    });
  }
}
