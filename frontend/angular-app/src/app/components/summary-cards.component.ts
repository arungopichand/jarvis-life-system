import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { StreakStats } from '../models/streak-stats';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-grid">
      <article class="stat-card">
        <span class="stat-card__label">Today XP Earned</span>
        <strong class="stat-card__value">{{ todayXpEarned }}</strong>
      </article>

      <article class="stat-card">
        <span class="stat-card__label">Total Possible XP</span>
        <strong class="stat-card__value">{{ totalPossibleXp }}</strong>
      </article>

      <article class="stat-card">
        <span class="stat-card__label">Current Level</span>
        <strong class="stat-card__value">Level {{ currentLevel }}</strong>
      </article>

      <article class="stat-card">
        <span class="stat-card__label">Daily Completion %</span>
        <strong class="stat-card__value">{{ dailyCompletionPercentage }}%</strong>
      </article>
    </section>

    <section class="streak-panel">
      <article class="streak-card">
        <div>
          <p class="streak-card__label">Current Streak</p>
          <strong class="streak-card__value">{{ streakStats.currentStreak }} day{{ streakStats.currentStreak === 1 ? '' : 's' }}</strong>
        </div>

        <div>
          <p class="streak-card__label">Longest Streak</p>
          <strong class="streak-card__value">{{ streakStats.longestStreak }} day{{ streakStats.longestStreak === 1 ? '' : 's' }}</strong>
        </div>
      </article>

      <p class="streak-reward-message">{{ streakRewardMessage }}</p>

      @if (streakStatsErrorMessage) {
        <p class="error-message streak-panel__error">{{ streakStatsErrorMessage }}</p>
      }
    </section>

    <section class="guide-panel">
      <div class="guide-panel__header">
        <div>
          <p class="guide-panel__eyebrow">Guidance</p>
          <h2>JARVIS Next Action</h2>
        </div>

        <button type="button" class="guide-button" (click)="refreshGuidance.emit()">
          Refresh Guidance
        </button>
      </div>

      <p class="guide-panel__message">{{ nextActionMessage }}</p>
    </section>
  `
})
export class SummaryCardsComponent {
  @Input({ required: true }) todayXpEarned!: number;
  @Input({ required: true }) totalPossibleXp!: number;
  @Input({ required: true }) currentLevel!: number;
  @Input({ required: true }) dailyCompletionPercentage!: number;
  @Input({ required: true }) streakStats!: StreakStats;
  @Input({ required: true }) streakRewardMessage!: string;
  @Input() streakStatsErrorMessage = '';
  @Input() nextActionMessage = '';

  @Output() refreshGuidance = new EventEmitter<void>();
}
