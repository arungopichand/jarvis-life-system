import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChecklistItem } from '../models/checklist-item';

@Component({
  selector: 'app-daily-checklist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="training-panel">
      <div class="training-panel__header">
        <div>
          <p class="training-panel__eyebrow">Routine</p>
          <h2>Daily Checklist</h2>
        </div>
      </div>

      <div class="review-grid">
        <article class="review-card checklist-card">
          <h3>Morning Checklist</h3>
          <p class="checklist-card__meta">{{ morningCompletedCount }}/{{ morningChecklist.length }} complete</p>

          <div class="checklist-list">
            @for (item of morningChecklist; track item.label) {
              <label class="checklist-item">
                <input
                  type="checkbox"
                  [(ngModel)]="item.completed"
                  [ngModelOptions]="{ standalone: true }"
                  (change)="morningChecklistChange.emit()"
                />
                <span>{{ item.label }}</span>
              </label>
            }
          </div>
        </article>

        <article class="review-card checklist-card">
          <h3>Night Checklist</h3>
          <p class="checklist-card__meta">{{ nightCompletedCount }}/{{ nightChecklist.length }} complete</p>

          <div class="checklist-list">
            @for (item of nightChecklist; track item.label) {
              <label class="checklist-item">
                <input
                  type="checkbox"
                  [(ngModel)]="item.completed"
                  [ngModelOptions]="{ standalone: true }"
                  (change)="nightChecklistChange.emit()"
                />
                <span>{{ item.label }}</span>
              </label>
            }
          </div>
        </article>
      </div>

      @if (errorMessage) {
        <p class="error-message" aria-live="assertive">{{ errorMessage }}</p>
      }

      @if (acknowledgementMessage) {
        <p class="checklist-acknowledgement" aria-live="polite">{{ acknowledgementMessage }}</p>
      }

      <p class="checklist-continuity">{{ continuityMessage }}</p>
    </section>
  `,
  styles: [`
    .checklist-card h3 {
      margin-top: 0;
      margin-bottom: 6px;
    }

    .checklist-card__meta {
      margin: 0 0 14px;
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .checklist-acknowledgement,
    .checklist-continuity {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .checklist-list {
      display: grid;
      gap: 12px;
    }

    .checklist-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border: 1px solid var(--metal-border);
      border-radius: 14px;
      background: var(--card-bg-muted);
      color: var(--text-main);
    }

    .checklist-item input {
      width: 18px;
      height: 18px;
      accent-color: var(--arc-cyan);
    }
  `]
})
export class DailyChecklistComponent {
  @Input({ required: true }) morningChecklist!: ChecklistItem[];
  @Input({ required: true }) nightChecklist!: ChecklistItem[];
  @Input() errorMessage = '';
  @Input() acknowledgementMessage = '';
  @Input() continuityMessage = '';

  @Output() morningChecklistChange = new EventEmitter<void>();
  @Output() nightChecklistChange = new EventEmitter<void>();

  get morningCompletedCount(): number {
    return this.morningChecklist.filter((item) => item.completed).length;
  }

  get nightCompletedCount(): number {
    return this.nightChecklist.filter((item) => item.completed).length;
  }
}
