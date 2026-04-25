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
        <div class="missions-panel__title-group">
          <h2>Today's Missions</h2>
          <span class="missions-panel__count">{{ missions.length }} missions</span>
        </div>

        <button type="button" class="reset-day-button" (click)="resetDay.emit()">
          Reset Day
        </button>
      </div>

      @if (isLoading) {
        <p class="info-message">Loading missions...</p>
      }

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      @if (!isLoading && missions.length === 0) {
        <p class="info-message">No missions found for today.</p>
      }

      <div class="mission-list">
        @for (mission of missions; track mission.id) {
          <article
            class="mission-card"
            [class.mission-card--completed]="mission.isCompleted"
            [class.mission-card--incomplete]="!mission.isCompleted"
            [class.mission-card--focus]="mission.id === focusMissionId"
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
      background: linear-gradient(180deg, rgba(8, 18, 32, 0.9), rgba(8, 17, 29, 0.96));
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

    .missions-panel__count {
      padding: 8px 12px;
      border: 1px solid var(--border-color);
      border-radius: 999px;
      color: var(--accent);
      background: rgba(73, 210, 255, 0.08);
      font-size: 0.9rem;
    }

    .reset-day-button {
      padding: 12px 16px;
      border: 1px solid rgba(73, 210, 255, 0.28);
      border-radius: 14px;
      background: rgba(73, 210, 255, 0.08);
      color: var(--text-main);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .reset-day-button:hover {
      transform: translateY(-1px);
      border-color: rgba(73, 210, 255, 0.6);
      background: rgba(73, 210, 255, 0.14);
    }

    .mission-list {
      display: grid;
      gap: 14px;
    }

    .mission-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      padding: 18px 20px;
      border: 1px solid rgba(73, 210, 255, 0.12);
      border-radius: 18px;
      background: var(--bg-card);
      box-shadow: 0 0 0 1px rgba(73, 210, 255, 0.02), 0 16px 40px rgba(0, 0, 0, 0.22);
    }

    .mission-card--incomplete {
      border-color: rgba(255, 180, 84, 0.24);
      box-shadow: 0 0 0 1px rgba(255, 180, 84, 0.05), 0 16px 40px rgba(0, 0, 0, 0.22);
    }

    .mission-card--completed {
      border-color: rgba(116, 240, 167, 0.24);
      background: linear-gradient(180deg, rgba(14, 34, 38, 0.95), rgba(11, 27, 30, 0.95));
    }

    .mission-card--focus {
      border-color: rgba(73, 210, 255, 0.4);
      box-shadow: 0 0 0 1px rgba(73, 210, 255, 0.12), 0 0 28px rgba(73, 210, 255, 0.12);
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
    }

    .focus-badge {
      padding: 6px 10px;
      border: 1px solid rgba(73, 210, 255, 0.24);
      border-radius: 999px;
      background: rgba(73, 210, 255, 0.1);
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
      background: rgba(255, 255, 255, 0.04);
    }

    .complete-button {
      min-width: 124px;
      padding: 12px 16px;
      border: 1px solid rgba(122, 246, 197, 0.35);
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(73, 210, 255, 0.22), rgba(122, 246, 197, 0.18));
      color: var(--text-main);
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .complete-button:hover:not(:disabled) {
      transform: translateY(-1px);
      border-color: rgba(122, 246, 197, 0.7);
      box-shadow: 0 0 24px var(--glow-color);
    }

    .complete-button:disabled {
      cursor: default;
      opacity: 0.7;
      color: #072117;
      background: linear-gradient(135deg, rgba(116, 240, 167, 0.92), rgba(157, 255, 201, 0.78));
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
  @Input() isLoading = false;
  @Input() errorMessage = '';

  @Output() completeMission = new EventEmitter<number>();
  @Output() resetDay = new EventEmitter<void>();
}
