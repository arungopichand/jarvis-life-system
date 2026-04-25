import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { StreakStats } from '../models/streak-stats';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-grid">
      <article class="stat-card stat-card--xp">
        <span class="stat-card__label">Today XP Earned</span>
        <strong class="stat-card__value">{{ todayXpEarned }}</strong>
        <span class="stat-card__hint">Daily output</span>
      </article>

      <article class="stat-card">
        <span class="stat-card__label">Total Possible XP</span>
        <strong class="stat-card__value">{{ totalPossibleXp }}</strong>
        <span class="stat-card__hint">Available today</span>
      </article>

      <article class="stat-card stat-card--level">
        <span class="stat-card__label">Current Level</span>
        <strong class="stat-card__value">Level {{ currentLevel }}</strong>
        <span class="stat-card__hint">Progress tier</span>
      </article>

      <article class="stat-card">
        <span class="stat-card__label">Daily Completion %</span>
        <strong class="stat-card__value">{{ dailyCompletionPercentage }}%</strong>
        <span class="stat-card__hint">Mission completion</span>
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
  `,
  styles: [`
    .stat-card {
      position: relative;
      overflow: hidden;
    }

    .stat-card::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(73, 210, 255, 0.55), transparent 78%);
    }

    .stat-card--xp::before,
    .stat-card--level::before {
      content: '';
      position: absolute;
      inset: auto -26px -30px auto;
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(73, 210, 255, 0.18), transparent 68%);
      pointer-events: none;
    }

    .stat-card__label {
      text-transform: uppercase;
      letter-spacing: 0.08rem;
    }

    .stat-card__value {
      display: block;
      margin-bottom: 8px;
    }

    .stat-card__hint {
      color: var(--text-muted);
      font-size: 0.82rem;
    }

    .streak-card {
      position: relative;
      overflow: hidden;
    }

    .streak-card::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(73, 210, 255, 0.45), transparent 80%);
    }

    .guide-panel__message {
      font-size: 1.04rem;
    }
  `]
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
