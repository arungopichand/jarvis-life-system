import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SummaryCardsComponent } from './components/summary-cards.component';
import { UserSettingsComponent } from './components/user-settings.component';
import { BattlePlanComponent } from './components/battle-plan.component';
import { MoodCheckInComponent } from './components/mood-check-in.component';
import { FocusTimerComponent } from './components/focus-timer.component';
import { AchievementsComponent } from './components/achievements.component';
import { IdentityUpgradeComponent } from './components/identity-upgrade.component';
import { DailyChecklistComponent } from './components/daily-checklist.component';
import { JarvisAssistantComponent } from './components/jarvis-assistant.component';
import { TrainingRoomComponent } from './components/training-room.component';
import { WeeklyReviewComponent } from './components/weekly-review.component';
import { FinanceLabComponent } from './components/finance-lab.component';
import { MissionHistoryComponent } from './components/mission-history.component';
import { MissionTemplatesComponent } from './components/mission-templates.component';
import { MissionsComponent } from './components/missions.component';
import { LearningLabComponent } from './components/learning-lab.component';
import { CommunicationLabComponent } from './components/communication-lab.component';
import { TodayCommandCenterComponent } from './components/today-command-center.component';
import { WritingStudioComponent } from './components/writing-studio.component';
import { Expense } from './models/expense';
import { DailyLifeProtocolComponent } from './components/daily-life-protocol.component';
import { HydrationControlComponent } from './components/hydration-control.component';
import { DopamineControlComponent } from './components/dopamine-control.component';
import { EmotionalStabilityComponent } from './components/emotional-stability.component';
import { SleepControlComponent } from './components/sleep-control.component';
import { WealthBuilderComponent } from './components/wealth-builder.component';
import { FounderDisciplineProtocolComponent } from './components/founder-discipline-protocol.component';
import { ChatMessage } from './models/chat-message';
import { ChecklistItem } from './models/checklist-item';
import { DailyLog } from './models/daily-log';
import { GuidanceState } from './models/guidance-state';
import { Mission } from './models/mission';
import { StreakStats } from './models/streak-stats';
import { UserSettings } from './models/user-settings';
import { WeeklyStats } from './models/weekly-stats';
import { LearningCategory, LearningLog, LearningRoadmap, LearningTodayPlan, LearningTopicStatus } from './models/learning-log';
import { CommunicationLog, CommunicationTodayPlan, CommunicationType } from './models/communication-log';
import { DailyGuide } from './models/daily-guide';
import { DailyProgressToday } from './models/daily-progress';
import { IncomeLog, IncomeMonthSummary } from './models/income-log';
import { DiaryEntry } from './models/diary-entry';
import { BlogDraft, BlogDraftStatus } from './models/blog-draft';
import { DailyLogService } from './services/daily-log.service';
import { ExpenseService } from './services/expense.service';
import { MissionService } from './services/mission.service';
import { SettingsService } from './services/settings.service';
import { StatsService } from './services/stats.service';
import { LearningService } from './services/learning.service';
import { CommunicationService } from './services/communication.service';
import { DailyGuideService } from './services/daily-guide.service';
import { IncomeService } from './services/income.service';
import { DiaryService } from './services/diary.service';
import { BlogDraftService } from './services/blog-draft.service';
import { DailyProgressService } from './services/daily-progress.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    BattlePlanComponent,
    MoodCheckInComponent,
    FocusTimerComponent,
    AchievementsComponent,
    IdentityUpgradeComponent,
    SummaryCardsComponent,
    UserSettingsComponent,
    DailyChecklistComponent,
    JarvisAssistantComponent,
    TrainingRoomComponent,
    WeeklyReviewComponent,
    FinanceLabComponent,
    MissionHistoryComponent,
    MissionTemplatesComponent,
    MissionsComponent,
    TodayCommandCenterComponent,
    LearningLabComponent,
    CommunicationLabComponent,
    WritingStudioComponent,
    DailyLifeProtocolComponent,
    HydrationControlComponent,
    DopamineControlComponent,
    EmotionalStabilityComponent,
    SleepControlComponent,
    WealthBuilderComponent,
    FounderDisciplineProtocolComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  encapsulation: ViewEncapsulation.None
})
export class App implements OnInit {
  readonly layoutModes = ['Daily Mode', 'Review Mode', 'Learning Mode', 'Communication Mode', 'Writing Mode', 'Setup Mode'] as const;
  private xpToastTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private missionEffectTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private missionAckTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private financeAckTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private checklistAckTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private streakProgressTimeoutId: ReturnType<typeof setTimeout> | null = null;

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
  selectedLayoutMode: typeof this.layoutModes[number] = 'Daily Mode';
  missions: Mission[] = [];
  expenses: Expense[] = [];
  isDisciplineModeActive = false;
  isLoading = true;
  errorMessage = '';
  financeErrorMessage = '';
  dailyLogErrorMessage = '';
  settingsErrorMessage = '';
  settingsSuccessMessage = '';
  streakStatsErrorMessage = '';
  weeklyStatsErrorMessage = '';
  learningErrorMessage = '';
  communicationErrorMessage = '';
  wealthErrorMessage = '';
  writingErrorMessage = '';
  dailyLog: DailyLog | null = null;
  todayGuide: DailyGuide | null = null;
  dailyProgress: DailyProgressToday | null = null;
  learningTodayPlan: LearningTodayPlan | null = null;
  learningRoadmap: LearningRoadmap | null = null;
  communicationTodayPlan: CommunicationTodayPlan | null = null;
  incomeMonthSummary: IncomeMonthSummary | null = null;
  recentIncomeLogs: IncomeLog[] = [];
  recentDiaryEntries: DiaryEntry[] = [];
  recentBlogDrafts: BlogDraft[] = [];
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
  todayLearningLogs: LearningLog[] = [];
  recentLearningLogs: LearningLog[] = [];
  todayCommunicationLogs: CommunicationLog[] = [];
  recentCommunicationLogs: CommunicationLog[] = [];
  englishPromptIndex = 0;
  confidencePromptIndex = 0;
  typingPromptIndex = 0;
  assistantMessage = '';
  disciplineModeMessage = '';
  selectedMood: 'Focused' | 'Lazy' | 'Tired' | 'Anxious' | 'Confident' | null = null;
  isFocusSessionComplete = false;
  xpGainMessage = '';
  missionAcknowledgement = '';
  financeAcknowledgement = '';
  checklistAcknowledgement = '';
  learningAcknowledgement = '';
  communicationAcknowledgement = '';
  streakProgressMessage = '';
  lastCompletedMissionTitle = '';
  lastLoggedExpenseTitle = '';
  checklistUpdatesCount = 0;
  sessionActionCount = 0;
  lastLearningTopic = '';
  lastCommunicationType: CommunicationType | '' = '';
  recentlyCompletedMissionId: number | null = null;
  chatHistory: ChatMessage[] = [];
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
  learningForm = {
    topic: '',
    category: 'CSharp' as LearningCategory,
    notes: '',
    difficulty: 3
  };
  communicationForm = {
    type: 'Vocabulary' as CommunicationType,
    content: '',
    confidenceLevel: 3,
    notes: ''
  };
  incomeForm = {
    source: '',
    amount: null as number | null,
    notes: ''
  };
  diaryForm = {
    mood: '',
    content: ''
  };
  blogDraftForm = {
    title: '',
    topic: '',
    content: '',
    status: 'Draft' as BlogDraftStatus
  };

  constructor(
    private dailyLogService: DailyLogService,
    private missionService: MissionService,
    private expenseService: ExpenseService,
    private settingsService: SettingsService,
    private statsService: StatsService,
    private learningService: LearningService,
    private communicationService: CommunicationService,
    private dailyGuideService: DailyGuideService,
    private dailyProgressService: DailyProgressService,
    private incomeService: IncomeService,
    private diaryService: DiaryService,
    private blogDraftService: BlogDraftService
  ) {}

  ngOnInit(): void {
    this.loadTodayGuide();
    this.loadDailyProgress();
    this.loadSettings();
    this.loadTodayDailyLog();
    this.loadTodayMissions();
    this.loadTodayExpenses();
    this.loadStreakStats();
    this.loadWeeklyStats();
    this.loadLearningTodayPlan();
    this.loadLearningRoadmap();
    this.loadRecentLearningLogs();
    this.loadCommunicationTodayPlan();
    this.loadRecentCommunicationLogs();
    this.loadIncomeMonthSummary();
    this.loadRecentIncomeLogs();
    this.loadRecentDiaryEntries();
    this.loadRecentBlogDrafts();
  }

  setLayoutMode(mode: typeof this.layoutModes[number]): void {
    this.selectedLayoutMode = mode;
  }

  activateDisciplineMode(): void {
    this.isDisciplineModeActive = true;
    this.selectedMood = 'Focused';
    this.disciplineModeMessage = 'Discipline Mode active. Lock onto the next mission and finish the block before switching.';

    const latestAssistantMessage = this.chatHistory.at(-1);
    if (latestAssistantMessage?.text !== this.disciplineModeMessage) {
      this.chatHistory.push({
        sender: 'assistant',
        text: this.disciplineModeMessage
      });
    }
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
        this.loadDailyProgress();
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
        this.isLoading = false;
        this.loadDailyProgress();
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
        this.lastCompletedMissionTitle = updatedMission.title;
        this.missionAcknowledgement = 'Logged. Staying consistent.';
        this.queueAcknowledgementClear('mission');
        this.logSessionAction();
        this.showMissionCompletionFeedback(updatedMission);
        this.loadDailyProgress();
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
  }

  loadStreakStats(): void {
    this.streakStatsErrorMessage = '';
    const previousStreak = this.streakStats.currentStreak;

    this.statsService.getStreakStats().subscribe({
      next: (stats) => {
        this.streakStats = stats;

        if (stats.currentStreak > previousStreak && previousStreak > 0) {
          this.queueStreakReinforcement(`Streak extended to ${stats.currentStreak} days. Keep the pattern steady.`);
        }
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
        this.lastLoggedExpenseTitle = expenseToCreate.title;
        this.financeAcknowledgement = 'Expense logged. Clarity maintained.';
        this.queueAcknowledgementClear('finance');
        this.logSessionAction();
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

  loadTodayGuide(): void {
    this.dailyGuideService.getToday().subscribe({
      next: (guide) => {
        this.todayGuide = guide;
      }
    });
  }

  loadDailyProgress(): void {
    this.dailyProgressService.getToday().subscribe({
      next: (progress) => {
        this.dailyProgress = progress;
      }
    });
  }

  loadLearningTodayPlan(): void {
    this.learningErrorMessage = '';

    this.learningService.getTodayPlan().subscribe({
      next: (plan) => {
        this.learningTodayPlan = plan;
      },
      error: () => {
        this.learningErrorMessage = 'Could not load learning plan.';
      }
    });
  }

  loadLearningRoadmap(): void {
    this.learningService.getRoadmap().subscribe({
      next: (roadmap) => {
        this.learningRoadmap = roadmap;
      }
    });
  }

  loadRecentLearningLogs(): void {
    this.learningService.getRecent().subscribe({
      next: (logs) => {
        this.recentLearningLogs = logs;
        const today = new Date().toDateString();
        this.todayLearningLogs = logs.filter((log) => new Date(log.createdAt).toDateString() === today);
      },
      error: () => {
        this.learningErrorMessage = 'Could not load learning logs.';
      }
    });
  }

  submitLearningLog(): void {
    if (!this.learningForm.topic.trim()) {
      this.learningErrorMessage = 'Please add a learning topic before logging.';
      return;
    }

    this.learningErrorMessage = '';

    this.learningService.addLog({
      topic: this.learningForm.topic,
      category: this.learningForm.category,
      notes: this.learningForm.notes,
      difficulty: this.learningForm.difficulty
    }).subscribe({
      next: () => {
        this.lastLearningTopic = this.learningForm.topic.trim();
        this.learningAcknowledgement = 'Learning log captured. Keep compounding.';
        this.learningForm = {
          topic: '',
          category: this.learningForm.category,
          notes: '',
          difficulty: 3
        };
        this.logSessionAction();
        this.loadDailyProgress();
        this.loadLearningTodayPlan();
        this.loadRecentLearningLogs();
      },
      error: () => {
        this.learningErrorMessage = 'Could not save the learning log.';
      }
    });
  }

  updateLearningTopicProgress(update: {
    topic: string;
    category: LearningCategory;
    status: LearningTopicStatus;
    confidenceLevel: number;
  }): void {
    this.learningService.updateTopicProgress({
      ...update,
      lastPracticedAt: new Date().toISOString()
    }).subscribe({
      next: () => {
        this.learningAcknowledgement = 'Roadmap progress updated.';
        this.loadLearningRoadmap();
      },
      error: () => {
        this.learningErrorMessage = 'Could not update roadmap progress.';
      }
    });
  }

  loadCommunicationTodayPlan(): void {
    this.communicationErrorMessage = '';

    this.communicationService.getToday().subscribe({
      next: (plan) => {
        this.communicationTodayPlan = plan;
      },
      error: () => {
        this.communicationErrorMessage = 'Could not load communication plan.';
      }
    });
  }

  loadRecentCommunicationLogs(): void {
    this.communicationService.getRecent().subscribe({
      next: (logs) => {
        this.recentCommunicationLogs = logs;
        const today = new Date().toDateString();
        this.todayCommunicationLogs = logs.filter((log) => new Date(log.createdAt).toDateString() === today);
      },
      error: () => {
        this.communicationErrorMessage = 'Could not load communication logs.';
      }
    });
  }

  submitCommunicationLog(): void {
    if (!this.communicationForm.content.trim()) {
      this.communicationErrorMessage = 'Please add communication content before logging.';
      return;
    }

    this.communicationErrorMessage = '';

    this.communicationService.addLog({
      type: this.communicationForm.type,
      content: this.communicationForm.content,
      confidenceLevel: this.communicationForm.confidenceLevel,
      notes: this.communicationForm.notes
    }).subscribe({
      next: () => {
        this.lastCommunicationType = this.communicationForm.type;
        this.communicationAcknowledgement = 'Communication practice logged.';
        this.communicationForm = {
          type: this.communicationForm.type,
          content: '',
          confidenceLevel: this.communicationForm.confidenceLevel,
          notes: ''
        };
        this.logSessionAction();
        this.loadDailyProgress();
        this.loadRecentCommunicationLogs();
      },
      error: () => {
        this.communicationErrorMessage = 'Could not save communication log.';
      }
    });
  }

  loadIncomeMonthSummary(): void {
    this.incomeService.getMonthSummary().subscribe({
      next: (summary) => {
        this.incomeMonthSummary = summary;
      }
    });
  }

  loadRecentIncomeLogs(): void {
    this.incomeService.getRecent().subscribe({
      next: (logs) => {
        this.recentIncomeLogs = logs;
      },
      error: () => {
        this.wealthErrorMessage = 'Could not load income logs.';
      }
    });
  }

  addIncomeLog(): void {
    if (!this.incomeForm.source.trim() || this.incomeForm.amount === null || this.incomeForm.amount <= 0) {
      this.wealthErrorMessage = 'Please enter source and amount to log income.';
      return;
    }

    this.wealthErrorMessage = '';

    this.incomeService.createIncome({
      source: this.incomeForm.source,
      amount: this.incomeForm.amount,
      notes: this.incomeForm.notes
    }).subscribe({
      next: () => {
        this.financeAcknowledgement = 'Income logged. Wealth momentum updated.';
        this.incomeForm = { source: '', amount: null, notes: '' };
        this.logSessionAction();
        this.loadDailyProgress();
        this.loadIncomeMonthSummary();
        this.loadRecentIncomeLogs();
      },
      error: () => {
        this.wealthErrorMessage = 'Could not log income right now.';
      }
    });
  }

  loadRecentDiaryEntries(): void {
    this.diaryService.getRecent().subscribe({
      next: (entries) => {
        this.recentDiaryEntries = entries;
      },
      error: () => {
        this.writingErrorMessage = 'Could not load diary entries.';
      }
    });
  }

  addDiaryEntry(): void {
    if (!this.diaryForm.mood.trim() || !this.diaryForm.content.trim()) {
      this.writingErrorMessage = 'Add mood and diary content before saving.';
      return;
    }

    this.writingErrorMessage = '';

    this.diaryService.createEntry({
      mood: this.diaryForm.mood,
      content: this.diaryForm.content,
      reflectionPrompt: this.todayGuide?.reflectionPrompt ?? ''
    }).subscribe({
      next: () => {
        this.learningAcknowledgement = 'Diary entry saved.';
        this.diaryForm = { mood: '', content: '' };
        this.logSessionAction();
        this.loadDailyProgress();
        this.loadRecentDiaryEntries();
      },
      error: () => {
        this.writingErrorMessage = 'Could not save diary entry.';
      }
    });
  }

  loadRecentBlogDrafts(): void {
    this.blogDraftService.getRecent().subscribe({
      next: (drafts) => {
        this.recentBlogDrafts = drafts;
      },
      error: () => {
        this.writingErrorMessage = 'Could not load blog drafts.';
      }
    });
  }

  addBlogDraft(): void {
    if (!this.blogDraftForm.title.trim() || !this.blogDraftForm.topic.trim() || !this.blogDraftForm.content.trim()) {
      this.writingErrorMessage = 'Fill title, topic, and content before saving a draft.';
      return;
    }

    this.writingErrorMessage = '';

    this.blogDraftService.createDraft(this.blogDraftForm).subscribe({
      next: () => {
        this.communicationAcknowledgement = 'Blog draft saved.';
        this.blogDraftForm = {
          title: '',
          topic: '',
          content: '',
          status: 'Draft'
        };
        this.logSessionAction();
        this.loadRecentBlogDrafts();
      },
      error: () => {
        this.writingErrorMessage = 'Could not save blog draft.';
      }
    });
  }

  markBlogDraftReady(id: number): void {
    this.blogDraftService.updateDraft(id, { status: 'Ready' }).subscribe({
      next: () => {
        this.communicationAcknowledgement = 'Blog draft marked as ready.';
        this.loadRecentBlogDrafts();
      },
      error: () => {
        this.writingErrorMessage = 'Could not update blog draft status.';
      }
    });
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

  get currentFocusMissionTitle(): string {
    const focusMission = this.missions.find((mission) => mission.id === this.focusMissionId);

    return focusMission?.title ?? 'Complete the next mission in queue';
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

  get dailyScore(): number {
    const missionScore = Math.round((this.dailyCompletionPercentage / 100) * 50);
    const checklistScore =
      (this.dailyLog?.morningCompleted ? 10 : 0) +
      (this.dailyLog?.nightCompleted ? 10 : 0);
    const spendingScore = this.totalSpentToday <= this.userSettings.dailySpendingLimit ? 15 : 0;
    const focusScore = this.isFocusSessionComplete ? 15 : 0;

    return missionScore + checklistScore + spendingScore + focusScore;
  }

  get dailyScoreStatus(): string {
    if (this.dailyScore <= 40) {
      return 'Low momentum. Complete one short mission to restart your day.';
    }

    if (this.dailyScore <= 70) {
      return 'Stable progress. One more focused block will lift the day.';
    }

    if (this.dailyScore <= 90) {
      return 'Strong day. Protect focus and close your priority missions.';
    }

    return 'Excellent execution. Keep the rhythm calm and deliberate.';
  }

  get streakRewardMessage(): string {
    if (this.streakStats.currentStreak === 0) {
      return 'No active streak yet. One completed mission starts it today.';
    }

    if (this.streakStats.currentStreak <= 2) {
      return 'Streak started. Protect it with one clean win each day.';
    }

    if (this.streakStats.currentStreak <= 6) {
      return 'Momentum is building. Consistency matters more than intensity.';
    }

    return 'Reliable streak. You are compounding trust with yourself.';
  }

  get recentActivitySummary(): string {
    if (this.lastCompletedMissionTitle) {
      return `Last completed: ${this.lastCompletedMissionTitle}`;
    }

    if (this.lastLearningTopic) {
      return `Last learning topic: ${this.lastLearningTopic}`;
    }

    if (this.lastCommunicationType) {
      return `Last communication rep: ${this.lastCommunicationType}`;
    }

    if (this.lastLoggedExpenseTitle) {
      return `Last logged expense: ${this.lastLoggedExpenseTitle}`;
    }

    if (this.checklistUpdatesCount > 0) {
      return `Checklist updates this session: ${this.checklistUpdatesCount}`;
    }

    return 'No recent activity yet. Start with one quick action.';
  }

  get checklistContinuityMessage(): string {
    if (this.checklistUpdatesCount === 0) {
      return 'No checklist updates yet. One check keeps continuity strong.';
    }

    return `Checklist updates this session: ${this.checklistUpdatesCount}.`;
  }

  get currentGuidanceState(): GuidanceState {
    const incompleteMissions = this.missions.filter((mission) => !mission.isCompleted);
    const easiestMission = [...incompleteMissions]
      .sort((left, right) => left.xpReward - right.xpReward)[0];
    const nextBestMission = incompleteMissions.find((mission) => mission.id === this.focusMissionId)
      ?? incompleteMissions[0];
    const hasMorningChecklistDone = this.areAllChecklistItemsCompleted(this.morningChecklist);
    const hasNightChecklistDone = this.areAllChecklistItemsCompleted(this.nightChecklist);
    const checklistSuggestion = !hasMorningChecklistDone
      ? 'Finish your morning checklist to lock in the day.'
      : !hasNightChecklistDone
        ? 'Keep your night checklist visible so you can close the day cleanly.'
        : 'Checklist status is solid. Keep the same rhythm.';

    let guidanceState: GuidanceState;

    if (this.selectedMood === 'Lazy') {
      guidanceState = {
        primaryAction: easiestMission
          ? `Do 5 minutes only on ${easiestMission.title}.`
          : 'Do 5 minutes only on one small review task.',
        secondarySuggestion: this.isFocusSessionComplete
          ? 'Focus block complete. Capture the win now by updating one mission.'
          : checklistSuggestion,
        warning: ''
      };
    } else if (this.totalSpentToday > this.userSettings.dailySpendingLimit) {
      guidanceState = {
        primaryAction: 'Spending limit crossed. Pause extra spending right now.',
        secondarySuggestion: 'Open Finance Lab, review today\'s log, and shift to no-cost progress tasks.',
        warning: `You are over your daily limit by ${Math.abs(this.totalSpentToday - this.userSettings.dailySpendingLimit).toFixed(2)}.`
      };
    } else if (this.completedMissionsToday === 0) {
      guidanceState = {
        primaryAction: easiestMission
          ? `Start with ${easiestMission.title}. It is your fastest momentum win.`
          : 'Start with one easy task to create momentum.',
        secondarySuggestion: this.isFocusSessionComplete
          ? 'A focus block just ended. Mark progress before context switches.'
          : checklistSuggestion,
        warning: ''
      };
    } else if (incompleteMissions.length > 0) {
      guidanceState = {
        primaryAction: nextBestMission
          ? `Next best mission: ${nextBestMission.title} (${nextBestMission.xpReward} XP).`
          : 'Pick the next mission and keep the streak alive.',
        secondarySuggestion: this.isFocusSessionComplete
          ? 'Focus block complete. Log one concrete outcome while it is fresh.'
          : `Keep your skill focus on ${this.userSettings.mainSkill || 'your main skill'} and maintain today\'s rhythm.`,
        warning: ''
      };
    } else {
      guidanceState = {
        primaryAction: 'All missions complete. Shift to review, recovery, or tomorrow planning.',
        secondarySuggestion: this.isFocusSessionComplete
          ? 'Close the loop: write one sentence on what made today work.'
          : 'Check Weekly Review, log expenses if needed, and end the day cleanly.',
        warning: ''
      };
    }

    return this.isDisciplineModeActive
      ? this.applyDisciplineModeTone(guidanceState, nextBestMission)
      : guidanceState;
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
        this.settingsSuccessMessage = 'Settings saved. Guidance has been updated for today.';
      },
      error: () => {
        this.settingsErrorMessage = 'Could not save user settings.';
      }
    });
  }

  onMorningChecklistChange(): void {
    this.isFocusSessionComplete = false;
    this.updateDailyLogFromChecklist('morning');
  }

  onNightChecklistChange(): void {
    this.isFocusSessionComplete = false;
    this.updateDailyLogFromChecklist('night');
  }

  onMoodSelected(mood: 'Focused' | 'Lazy' | 'Tired' | 'Anxious' | 'Confident'): void {
    this.selectedMood = mood;
  }

  onFocusTimerCompleted(isComplete: boolean): void {
    this.isFocusSessionComplete = isComplete;
  }

  private showMissionCompletionFeedback(mission: Mission): void {
    this.xpGainMessage = `Mission complete: +${mission.xpReward} XP. Keep the chain moving.`;
    this.recentlyCompletedMissionId = mission.id;

    if (this.xpToastTimeoutId) {
      clearTimeout(this.xpToastTimeoutId);
    }

    if (this.missionEffectTimeoutId) {
      clearTimeout(this.missionEffectTimeoutId);
    }

    this.xpToastTimeoutId = setTimeout(() => {
      this.xpGainMessage = '';
      this.xpToastTimeoutId = null;
    }, 2000);

    this.missionEffectTimeoutId = setTimeout(() => {
      this.recentlyCompletedMissionId = null;
      this.missionEffectTimeoutId = null;
    }, 2000);
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
    let reply: string;
    const focusMission = this.missions.find((mission) => mission.id === this.focusMissionId);
    const overLimitAmount = this.totalSpentToday - this.userSettings.dailySpendingLimit;
    const learningTopic = this.learningTodayPlan?.topic ?? this.todayGuide?.learningTopic ?? this.userSettings.mainSkill;
    const confidenceDrill = this.communicationTodayPlan?.confidenceDrill ?? this.todayGuide?.confidenceDrill ?? this.currentConfidencePrompt;
    const englishWord = this.communicationTodayPlan?.word ?? this.todayGuide?.englishWord ?? 'deliberate';
    const incomeProgress = this.incomeMonthSummary?.goalProgressPercentage ?? 0;
    const nextAction = this.resolveSingleNextAction();

    if (normalizedMessage.includes('what should i learn') || normalizedMessage.includes('help me with .net') || normalizedMessage.includes('study') || normalizedMessage.includes('learn')) {
      reply = focusMission
        ? `Learn ${learningTopic}. Then complete ${focusMission.title} in a 25-minute block and log one output.`
        : `Learn ${learningTopic}. Run one 25-minute block and log one practical outcome.`;
      return this.applyAssistantTone(reply);
    }

    if (normalizedMessage.includes('how can i improve today') || normalizedMessage.includes('what should i do next') || normalizedMessage.includes('next')) {
      reply = `Next action: ${nextAction}`;
      return this.applyAssistantTone(reply);
    }

    if (normalizedMessage.includes('lazy') || normalizedMessage.includes('procrastinate') || normalizedMessage.includes('motivation')) {
      reply = focusMission
        ? `Lower friction: commit 5 minutes to ${focusMission.title}. Then apply this confidence drill: ${confidenceDrill}`
        : `Lower friction: commit 5 minutes to one small task. Confidence drill: ${confidenceDrill}`;
      return this.applyAssistantTone(reply);
    }

    if (normalizedMessage.includes('money') || normalizedMessage.includes('spend')) {
      reply = overLimitAmount > 0
        ? `You are over limit by ${overLimitAmount.toFixed(2)}. Pause spending and focus on income actions.`
        : `You are within limit by ${(this.userSettings.dailySpendingLimit - this.totalSpentToday).toFixed(2)}. Income goal progress is ${incomeProgress.toFixed(1)}% this month.`;

      if (this.lastLoggedExpenseTitle) {
        reply += ` Last logged expense: ${this.lastLoggedExpenseTitle}.`;
      }

      return this.applyAssistantTone(reply);
    }

    if (normalizedMessage.includes('english') || normalizedMessage.includes('communication') || normalizedMessage.includes('speaking')) {
      reply = `Word of the day: ${englishWord}. Speaking prompt: ${this.communicationTodayPlan?.speakingPrompt ?? this.currentEnglishPrompt}. Confidence drill: ${confidenceDrill}`;
      return this.applyAssistantTone(reply);
    }

    if (normalizedMessage.includes('confidence')) {
      reply = `Run this drill now: ${confidenceDrill}`;
      return this.applyAssistantTone(reply);
    }

    if (normalizedMessage.includes('gym')) {
      reply = `Start a minimum entry: 10 minutes now. Your target is ${this.userSettings.gymMinutesTarget} minutes, but momentum begins with the first rep.`;
      return this.applyAssistantTone(reply);
    }

    reply = `Next action: ${nextAction}`;

    if (this.sessionActionCount > 0) {
      reply += ` You have already logged ${this.sessionActionCount} action${this.sessionActionCount === 1 ? '' : 's'} this session.`;
    }

    return this.applyAssistantTone(reply);
  }

  private applyDailyLogToChecklist(): void {
    const morningCompleted = this.dailyLog?.morningCompleted ?? false;
    const nightCompleted = this.dailyLog?.nightCompleted ?? false;

    this.setChecklistCompletion(this.morningChecklist, morningCompleted);
    this.setChecklistCompletion(this.nightChecklist, nightCompleted);
  }

  private updateDailyLogFromChecklist(source: 'morning' | 'night'): void {
    const morningCompleted = this.areAllChecklistItemsCompleted(this.morningChecklist);
    const nightCompleted = this.areAllChecklistItemsCompleted(this.nightChecklist);

    this.dailyLogErrorMessage = '';

    this.dailyLogService.updateDailyLog(morningCompleted, nightCompleted).subscribe({
      next: (dailyLog) => {
        this.dailyLog = dailyLog;
        this.checklistUpdatesCount += 1;
        this.logSessionAction();

        if (source === 'morning' && morningCompleted) {
          this.checklistAcknowledgement = 'Morning checklist complete. Day alignment locked.';
        } else if (source === 'night' && nightCompleted) {
          this.checklistAcknowledgement = 'Night checklist complete. Clean close recorded.';
        } else {
          this.checklistAcknowledgement = 'Checklist updated. Staying in rhythm.';
        }

        this.loadDailyProgress();
        this.queueAcknowledgementClear('checklist');
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

  private queueAcknowledgementClear(target: 'mission' | 'finance' | 'checklist'): void {
    if (target === 'mission' && this.missionAckTimeoutId) {
      clearTimeout(this.missionAckTimeoutId);
    }

    if (target === 'finance' && this.financeAckTimeoutId) {
      clearTimeout(this.financeAckTimeoutId);
    }

    if (target === 'checklist' && this.checklistAckTimeoutId) {
      clearTimeout(this.checklistAckTimeoutId);
    }

    const timeoutId = setTimeout(() => {
      if (target === 'mission') {
        this.missionAcknowledgement = '';
        this.missionAckTimeoutId = null;
      }

      if (target === 'finance') {
        this.financeAcknowledgement = '';
        this.financeAckTimeoutId = null;
      }

      if (target === 'checklist') {
        this.checklistAcknowledgement = '';
        this.checklistAckTimeoutId = null;
      }
    }, 3200);

    if (target === 'mission') {
      this.missionAckTimeoutId = timeoutId;
    }

    if (target === 'finance') {
      this.financeAckTimeoutId = timeoutId;
    }

    if (target === 'checklist') {
      this.checklistAckTimeoutId = timeoutId;
    }
  }

  private queueStreakReinforcement(message: string): void {
    if (this.streakProgressTimeoutId) {
      clearTimeout(this.streakProgressTimeoutId);
    }

    this.streakProgressTimeoutId = setTimeout(() => {
      this.streakProgressMessage = message;
      this.streakProgressTimeoutId = setTimeout(() => {
        this.streakProgressMessage = '';
        this.streakProgressTimeoutId = null;
      }, 4200);
    }, 900);
  }

  private logSessionAction(): void {
    this.sessionActionCount += 1;
  }

  private resolveSingleNextAction(): string {
    if (this.dailyProgress?.nextRecommendedAction) {
      return this.dailyProgress.nextRecommendedAction;
    }

    const focusMission = this.missions.find((mission) => mission.id === this.focusMissionId);
    if (focusMission) {
      return `Complete ${focusMission.title} and mark it done.`;
    }

    return this.currentGuidanceState.primaryAction;
  }

  private applyDisciplineModeTone(guidanceState: GuidanceState, nextBestMission: Mission | undefined): GuidanceState {
    const executionTarget = nextBestMission
      ? `${nextBestMission.title} for ${nextBestMission.xpReward} XP`
      : 'the next mission block';

    return {
      primaryAction: nextBestMission
        ? `Execute ${executionTarget}. Finish the block cleanly, then move to the next checkpoint.`
        : guidanceState.primaryAction,
      secondarySuggestion: this.isFocusSessionComplete
        ? 'Timer complete. Log the result and start the next block without delay.'
        : 'Run a 25-minute deep-work block and measure output by completed work.',
      warning: guidanceState.warning
        ? `Critical check: ${guidanceState.warning}`
        : 'No active warning. Stay deliberate and protect momentum.'
    };
  }

  private applyAssistantTone(reply: string): string {
    if (!this.isDisciplineModeActive) {
      return reply;
    }

    return `Discipline Mode: ${reply} Execute cleanly and report progress with completed actions.`;
  }
}
