import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { GuidanceState } from '../models/guidance-state';
import { StreakStats } from '../models/streak-stats';

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="stats-grid">
      <article class="stat-card stat-card--score stat-card--wide">
        <span class="stat-card__label">Daily Score</span>
        <strong class="stat-card__value">Daily Score: {{ dailyScore }} / 100</strong>
        <span class="stat-card__hint">{{ dailyScoreStatus }}</span>
      </article>

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
      <div class="guide-panel__header guide-panel__header--stacked">
        <div>
          <p class="guide-panel__eyebrow">Guidance</p>
          <h2>Current Guidance State</h2>
        </div>
      </div>

      <p class="guide-panel__primary-action">{{ guidanceState.primaryAction }}</p>

      <div class="guide-panel__details">
        <article class="guide-detail-card">
          <span class="guide-detail-card__label">Secondary Suggestion</span>
          <p>{{ guidanceState.secondarySuggestion }}</p>
        </article>

        <article class="guide-detail-card guide-detail-card--warning" [class.guide-detail-card--muted]="!guidanceState.warning">
          <span class="guide-detail-card__label">Warning</span>
          <p>{{ guidanceState.warning || 'No warning. Keep moving.' }}</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .stat-card {
      position: relative;
      overflow: hidden;
    }

    .stat-card--wide {
      grid-column: span 2;
    }

    .stat-card--score {
      border-color: rgba(122, 246, 197, 0.22);
      background: linear-gradient(135deg, rgba(8, 32, 35, 0.96), rgba(9, 24, 37, 0.94));
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

    @media (max-width: 820px) {
      .stat-card--wide {
        grid-column: span 2;
      }
    }

    @media (max-width: 640px) {
      .stat-card--wide {
        grid-column: span 1;
      }
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

    .guide-panel__header--stacked {
      margin-bottom: 14px;
    }

    .guide-panel__primary-action {
      margin: 0 0 16px;
      color: var(--text-main);
      font-size: clamp(1.35rem, 3vw, 2rem);
      font-weight: 700;
      line-height: 1.35;
    }

    .guide-panel__details {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .guide-detail-card {
      padding: 16px 18px;
      border: 1px solid rgba(73, 210, 255, 0.12);
      border-radius: 18px;
      background: rgba(7, 21, 32, 0.42);
    }

    .guide-detail-card--warning {
      border-color: rgba(255, 180, 84, 0.18);
      background: rgba(255, 180, 84, 0.08);
    }

    .guide-detail-card--muted {
      border-color: rgba(73, 210, 255, 0.1);
      background: rgba(255, 255, 255, 0.03);
    }

    .guide-detail-card__label {
      display: block;
      margin-bottom: 8px;
      color: var(--accent);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .guide-detail-card p {
      margin: 0;
      color: var(--text-main);
      line-height: 1.65;
    }

    @media (max-width: 820px) {
      .guide-panel__details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SummaryCardsComponent {
  @Input({ required: true }) todayXpEarned!: number;
  @Input({ required: true }) totalPossibleXp!: number;
  @Input({ required: true }) currentLevel!: number;
  @Input({ required: true }) dailyCompletionPercentage!: number;
  @Input({ required: true }) dailyScore!: number;
  @Input({ required: true }) dailyScoreStatus!: string;
  @Input({ required: true }) streakStats!: StreakStats;
  @Input({ required: true }) streakRewardMessage!: string;
  @Input({ required: true }) guidanceState!: GuidanceState;
  @Input() streakStatsErrorMessage = '';
}
