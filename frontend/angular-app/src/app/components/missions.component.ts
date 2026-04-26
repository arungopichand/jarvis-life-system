import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Mission } from '../models/mission';

@Component({
  selector: 'app-missions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="missions-panel">
      <div class="missions-panel__header">
        <div>
          <div class="missions-panel__title-group">
            <h2>Today's Missions</h2>
            <span class="missions-panel__count">{{ missions.length }} missions</span>
          </div>
          <p class="missions-panel__subtitle">
            Work from the highlighted mission first, then clear the rest with one action at a time.
          </p>
          <p class="missions-panel__context">{{ missionContextMessage }}</p>
        </div>

        <button type="button" class="reset-day-button" (click)="resetDay.emit()">
          Reset Day
        </button>
      </div>

      @if (isLoading) {
        <p class="info-message mission-feedback" aria-live="polite">Preparing today's mission board...</p>
      }

      @if (errorMessage) {
        <p class="error-message mission-feedback" aria-live="assertive">{{ errorMessage }}</p>
      }

      @if (!isLoading && missions.length === 0) {
        <p class="info-message mission-feedback" aria-live="polite">No missions queued yet. Add templates in Setup Mode to start your next action.</p>
      }

      @if (acknowledgementMessage) {
        <p class="mission-acknowledgement" aria-live="polite">{{ acknowledgementMessage }}</p>
      }

      @if (lastCompletedMissionTitle) {
        <p class="mission-continuity">Last completed: {{ lastCompletedMissionTitle }}</p>
      }

      <div class="mission-list">
        @for (mission of missions; track mission.id) {
          <article
            class="mission-card"
            [class.mission-card--completed]="mission.isCompleted"
            [class.mission-card--incomplete]="!mission.isCompleted"
            [class.mission-card--focus]="mission.id === focusMissionId"
            [class.mission-card--celebrate]="mission.id === recentlyCompletedMissionId"
          >
            <div class="mission-card__content">
              <div class="mission-card__top-row">
                <div class="mission-card__heading">
                  <h3>{{ mission.title }}</h3>

                  @if (mission.id === focusMissionId && !mission.isCompleted) {
                    <span class="focus-badge">Focus Now</span>
                  }
                </div>

                <span class="mission-card__xp">{{ mission.xpReward }} XP</span>
              </div>

              <div class="mission-card__meta">
                <span>{{ mission.category }}</span>
                <span>{{ mission.isCompleted ? 'Completed' : 'In Progress' }}</span>
              </div>
            </div>

            <button
              type="button"
              class="complete-button"
              (click)="completeMission.emit(mission.id)"
              [disabled]="mission.isCompleted"
            >
              {{ mission.isCompleted ? 'Completed' : 'Complete' }}
            </button>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .missions-panel {
      padding: 24px;
      border: 1px solid var(--border-color);
      border-radius: 24px;
      background: linear-gradient(180deg, var(--elev-2), var(--color-surface-inset));
    }

    .missions-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .missions-panel__title-group {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .missions-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .missions-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 560px;
      line-height: 1.6;
    }

    .missions-panel__count {
      padding: 8px 12px;
      border: 1px solid var(--color-border-soft);
      border-radius: 999px;
      color: var(--text-muted);
      background: var(--state-hover);
      font-size: 0.9rem;
    }

    .missions-panel__context {
      margin: 8px 0 0;
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .reset-day-button {
      padding: 12px 16px;
      border: 1px solid rgba(var(--h), 0.28);
      border-radius: 14px;
      background: rgba(var(--h), 0.08);
      color: var(--text-main);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-interactive);
    }

    .reset-day-button:hover {
      transform: translateY(-1px);
      border-color: rgba(var(--h), 0.52);
      background: rgba(var(--h), 0.14);
    }

    .mission-list {
      display: grid;
      gap: 14px;
    }

    .mission-feedback {
      margin: 0 0 14px;
    }

    .mission-acknowledgement,
    .mission-continuity {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .mission-card {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--bg-card);
      box-shadow: var(--shadow-md);
      overflow: hidden;
    }

    .mission-card::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(var(--a), 0.2), transparent 82%);
    }

    .mission-card--incomplete {
      border-color: rgba(var(--h), 0.2);
    }

    .mission-card--completed {
      border-color: rgba(var(--s), 0.28);
      background: var(--panel-bg-success);
    }

    .mission-card--focus {
      border-color: rgba(var(--a), 0.4);
      box-shadow: 0 0 0 1px rgba(var(--a), 0.1), var(--glow-soft);
    }

    .mission-card--celebrate {
      animation: missionCelebrate 1.2s ease;
    }

    .mission-card__content {
      flex: 1;
    }

    .mission-card__top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .mission-card__heading {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .mission-card__top-row h3 {
      margin: 0;
      font-size: 1.1rem;
      line-height: 1.35;
    }

    .focus-badge {
      padding: 6px 10px;
      border: 1px solid rgba(var(--a), 0.24);
      border-radius: 999px;
      background: rgba(var(--a), 0.08);
      color: var(--accent);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.03rem;
      text-transform: uppercase;
    }

    .mission-card__xp {
      color: var(--warning);
      font-weight: 700;
      white-space: nowrap;
    }

    .mission-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--text-muted);
      font-size: 0.92rem;
    }

    .mission-card__meta span {
      padding: 6px 10px;
      border-radius: 999px;
      background: var(--card-bg-muted);
    }

    .complete-button {
      min-width: 124px;
      padding: 12px 16px;
      border: 1px solid rgba(var(--a), 0.35);
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(var(--a), 0.22), rgba(var(--h), 0.18));
      color: var(--text-main);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform var(--motion-fast) ease, box-shadow var(--motion-base) ease, border-color var(--motion-base) ease, background var(--motion-base) ease;
    }

    .complete-button:hover:not(:disabled) {
      transform: translateY(-1px);
      border-color: rgba(var(--h), 0.7);
      box-shadow: var(--glow-mid);
    }

    .complete-button:disabled {
      cursor: default;
      opacity: 1;
      border-color: rgba(var(--s), 0.24);
      color: var(--text-muted);
      background: rgba(var(--s), 0.16);
      box-shadow: none;
    }

    @keyframes missionCelebrate {
      0% {
        transform: scale(1);
        box-shadow: 0 0 0 1px rgba(var(--s), 0.08), 0 0 0 rgba(var(--s), 0);
      }
      35% {
        transform: scale(1.01);
        box-shadow: 0 0 0 1px rgba(var(--s), 0.2), 0 0 26px rgba(var(--s), 0.18);
      }
      100% {
        transform: scale(1);
      }
    }

    @media (max-width: 820px) {
      .mission-card {
        flex-direction: column;
        align-items: stretch;
      }

      .mission-card__top-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .complete-button {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .missions-panel {
        padding: 18px;
      }

      .missions-panel__header {
        flex-direction: column;
        align-items: flex-start;
      }

      .missions-panel__title-group {
        align-items: flex-start;
      }
    }
  `]
})
export class MissionsComponent {
  @Input({ required: true }) missions!: Mission[];
  @Input() focusMissionId: number | null = null;
  @Input() recentlyCompletedMissionId: number | null = null;
  @Input() isLoading = false;
  @Input() errorMessage = '';
  @Input() acknowledgementMessage = '';
  @Input() lastCompletedMissionTitle = '';

  @Output() completeMission = new EventEmitter<number>();
  @Output() resetDay = new EventEmitter<void>();

  get missionContextMessage(): string {
    const remaining = this.missions.filter((mission) => !mission.isCompleted).length;

    if (this.isLoading) {
      return 'Syncing today\'s priorities...';
    }

    if (this.missions.length === 0) {
      return 'No missions yet. Build today\'s list in Setup Mode.';
    }

    if (remaining === 0) {
      return 'Everything is complete. Shift to review mode or recover for your next block.';
    }

    if (remaining === 1) {
      return 'One mission left. Finish clean and close the day strong.';
    }

    return `${remaining} missions remaining. Keep a steady pace and complete the focus item first.`;
  }
}
