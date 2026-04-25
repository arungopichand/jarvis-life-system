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
        <article class="review-card">
          <h3>Morning Checklist</h3>

          <div style="display: grid; gap: 12px;">
            @for (item of morningChecklist; track item.label) {
              <label style="display: flex; align-items: center; gap: 12px;">
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

        <article class="review-card">
          <h3>Night Checklist</h3>

          <div style="display: grid; gap: 12px;">
            @for (item of nightChecklist; track item.label) {
              <label style="display: flex; align-items: center; gap: 12px;">
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
        <p class="error-message">{{ errorMessage }}</p>
      }
    </section>
  `
})
export class DailyChecklistComponent {
  @Input({ required: true }) morningChecklist!: ChecklistItem[];
  @Input({ required: true }) nightChecklist!: ChecklistItem[];
  @Input() errorMessage = '';

  @Output() morningChecklistChange = new EventEmitter<void>();
  @Output() nightChecklistChange = new EventEmitter<void>();
}
