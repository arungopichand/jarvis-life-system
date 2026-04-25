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
  `
})
export class MissionsComponent {
  @Input({ required: true }) missions!: Mission[];
  @Input() focusMissionId: number | null = null;
  @Input() isLoading = false;
  @Input() errorMessage = '';

  @Output() completeMission = new EventEmitter<number>();
  @Output() resetDay = new EventEmitter<void>();
}
