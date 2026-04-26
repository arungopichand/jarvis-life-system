import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MissionHistoryDay } from '../models/mission-history';
import { MissionService } from '../services/mission.service';

@Component({
  selector: 'app-mission-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="history-panel ui-panel">
      <div class="history-panel__header">
        <div>
          <p class="history-panel__eyebrow">Archive</p>
          <h2>Mission History</h2>
          <p class="history-panel__subtitle">
            Review progress across the last few days and expand any day to see the mission details.
          </p>
        </div>

        <label class="history-panel__filter">
          <span>Days</span>
          <select
            name="historyDays"
            [(ngModel)]="selectedDays"
            (ngModelChange)="onDaysChange()"
          >
            @for (option of dayOptions; track option) {
              <option [ngValue]="option">{{ option }}</option>
            }
          </select>
        </label>
      </div>

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      @if (isLoading) {
        <p class="info-message" aria-live="polite">Loading mission history...</p>
      }

      @if (!isLoading && history.length === 0) {
        <p class="info-message" aria-live="polite">No mission history yet. Complete a few missions and this timeline will start filling in.</p>
      }

      <div class="history-list">
        @for (day of history; track day.date) {
          <article class="history-card ui-card ui-accent-line">
            <button
              type="button"
              class="history-card__summary"
              (click)="toggleDay(day.date)"
              [attr.aria-expanded]="isExpanded(day.date)"
            >
              <div class="history-card__summary-main">
                <div class="history-card__title-group">
                  <h3>{{ formatDate(day.date) }}</h3>
                  <span class="history-card__badge ui-chip ui-chip--info">
                    {{ day.completedMissions }}/{{ day.totalMissions }} complete
                  </span>
                </div>

                <div class="history-card__meta">
                  <span class="ui-chip">{{ day.completionPercentage }}%</span>
                  <span class="ui-chip">{{ day.totalMissions === 0 ? 'No missions' : 'Mission day' }}</span>
                </div>
              </div>

              <span class="history-card__toggle ui-chip">
                {{ isExpanded(day.date) ? 'Hide Details' : 'Show Details' }}
              </span>
            </button>

            @if (isExpanded(day.date)) {
              <div class="history-card__details">
                @if (day.missions.length === 0) {
                  <p class="info-message history-card__empty">
                    No missions were created on this day.
                  </p>
                }

                <div class="history-missions">
                  @for (mission of day.missions; track mission.id) {
                    <article
                      class="history-mission ui-card ui-card--inset"
                      [class.history-mission--completed]="mission.isCompleted"
                      [class.history-mission--missed]="!mission.isCompleted"
                    >
                      <div class="history-mission__content">
                        <div class="history-mission__top-row">
                          <h4>{{ mission.title }}</h4>
                          <span class="history-mission__xp">{{ mission.xpReward }} XP</span>
                        </div>

                        <div class="history-mission__meta">
                          <span>{{ mission.category }}</span>
                          <span>{{ mission.isCompleted ? 'Completed' : 'Missed' }}</span>
                        </div>
                      </div>
                    </article>
                  }
                </div>
              </div>
            }
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .history-panel {
      padding: 24px;
    }

    .history-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
    }

    .history-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--text-muted);
      letter-spacing: 0.2rem;
      text-transform: uppercase;
      font-size: 0.74rem;
    }

    .history-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .history-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 460px;
    }

    .history-panel__filter {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 120px;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .history-panel__filter select {
      padding: 12px 14px;
      border: 1px solid var(--metal-border);
      border-radius: 14px;
      background: var(--color-surface-inset);
      color: var(--text-main);
      outline: none;
      font: inherit;
    }

    .history-panel__filter select:focus {
      border-color: rgba(var(--a), 0.65);
      box-shadow: 0 0 0 3px rgba(var(--a), 0.12);
    }

    .history-list {
      display: grid;
      gap: 14px;
    }

    .history-card {
      position: relative;
    }

    .history-card__summary {
      width: 100%;
      padding: 18px 20px;
      border: 0;
      background: transparent;
      color: inherit;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      text-align: left;
      cursor: pointer;
    }

    .history-card__summary:hover {
      background: var(--state-hover);
    }

    .history-card__summary-main {
      flex: 1;
    }

    .history-card__title-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 10px;
    }

    .history-card__title-group h3 {
      margin: 0;
      font-size: 1.08rem;
    }

    .history-card__badge {
      font-size: 0.84rem;
    }

    .history-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--text-muted);
      font-size: 0.92rem;
    }

    .history-card__meta span,
    .history-card__toggle {
      white-space: nowrap;
    }

    .history-card__toggle {
      color: var(--text-main);
      white-space: nowrap;
    }

    .history-card__details {
      padding: 0 20px 20px;
      border-top: 1px solid var(--color-border-soft);
    }

    .history-card__empty {
      margin-top: 16px;
      margin-bottom: 0;
    }

    .history-missions {
      display: grid;
      gap: 12px;
      margin-top: 16px;
    }

    .history-mission {
      padding: 16px 18px;
    }

    .history-mission--completed {
      border-color: rgba(var(--s), 0.3);
      background: var(--gradient-success);
    }

    .history-mission--missed {
      border-color: rgba(var(--h), 0.22);
    }

    .history-mission__top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .history-mission__top-row h4 {
      margin: 0;
      font-size: 1rem;
    }

    .history-mission__xp {
      color: var(--warning);
      font-weight: 700;
      white-space: nowrap;
    }

    .history-mission__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      color: var(--text-muted);
      font-size: 0.9rem;
    }

    .history-mission__meta span {
      padding: 6px 10px;
      border-radius: 999px;
      background: var(--card-bg-muted);
    }

    @media (max-width: 820px) {
      .history-panel__header,
      .history-card__summary,
      .history-mission__top-row {
        flex-direction: column;
        align-items: stretch;
      }

      .history-panel__filter {
        min-width: 0;
      }

      .history-card__toggle {
        width: fit-content;
      }
    }

    @media (max-width: 640px) {
      .history-panel {
        padding: 18px;
      }
    }
  `]
})
export class MissionHistoryComponent implements OnInit {
  readonly dayOptions = [7, 30, 90];

  history: MissionHistoryDay[] = [];
  selectedDays = 30;
  isLoading = false;
  errorMessage = '';
  private readonly expandedDates = new Set<string>();

  constructor(private missionService: MissionService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  onDaysChange(): void {
    this.loadHistory();
  }

  toggleDay(date: string): void {
    if (this.expandedDates.has(date)) {
      this.expandedDates.delete(date);
      return;
    }

    this.expandedDates.add(date);
  }

  isExpanded(date: string): boolean {
    return this.expandedDates.has(date);
  }

  formatDate(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  private loadHistory(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.expandedDates.clear();

    this.missionService.getMissionHistory(this.selectedDays).subscribe({
      next: (history) => {
        this.history = [...history].reverse();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load mission history.';
        this.isLoading = false;
      }
    });
  }
}
