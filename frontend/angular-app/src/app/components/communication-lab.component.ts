import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommunicationLog, CommunicationTodayPlan, CommunicationType } from '../models/communication-log';

@Component({
  selector: 'app-communication-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="training-panel communication-panel">
      <div class="training-panel__header">
        <div>
          <p class="training-panel__eyebrow">Communication Command</p>
          <h2>English + Speaking Confidence</h2>
          <p class="communication-panel__subtitle">
            Train one focused communication rep each day using guided vocabulary and speaking prompts.
          </p>
        </div>
      </div>

      <div class="communication-today ui-card ui-accent-line">
        <span class="communication-today__label">Word Of The Day</span>
        <h3>{{ todayPlan?.word || 'Loading word...' }}</h3>
        <p><strong>Meaning:</strong> {{ todayPlan?.meaning }}</p>
        <p><strong>Example:</strong> {{ todayPlan?.exampleSentence }}</p>
        <p><strong>Speaking Prompt:</strong> {{ todayPlan?.speakingPrompt }}</p>
        <p><strong>Confidence Drill:</strong> {{ todayPlan?.confidenceDrill }}</p>
      </div>

      <form class="communication-form" (ngSubmit)="submit.emit()">
        <label class="field">
          <span>Type</span>
          <select
            name="type"
            [ngModel]="form.type"
            (ngModelChange)="updateField('type', $event)"
          >
            @for (option of types; track option) {
              <option [ngValue]="option">{{ option }}</option>
            }
          </select>
        </label>

        <label class="field">
          <span>Confidence (1-5)</span>
          <input
            type="number"
            name="confidenceLevel"
            [ngModel]="form.confidenceLevel"
            (ngModelChange)="updateField('confidenceLevel', $event)"
            min="1"
            max="5"
            step="1"
          />
        </label>

        <label class="field communication-form__content">
          <span>Content</span>
          <textarea
            name="content"
            [ngModel]="form.content"
            (ngModelChange)="updateField('content', $event)"
            rows="3"
            placeholder="Write your vocabulary sentence or speaking reflection."
          ></textarea>
        </label>

        <label class="field communication-form__notes">
          <span>Notes</span>
          <input
            type="text"
            name="notes"
            [ngModel]="form.notes"
            (ngModelChange)="updateField('notes', $event)"
            placeholder="What improved today?"
          />
        </label>

        <button type="submit" class="finance-button" [disabled]="!isFormValid">
          Log Communication
        </button>
      </form>

      @if (acknowledgementMessage) {
        <p class="communication-panel__feedback" aria-live="polite">{{ acknowledgementMessage }}</p>
      }

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      <div class="communication-list">
        @for (log of recentLogs; track log.id) {
          <article class="communication-item ui-card ui-accent-line">
            <div class="communication-item__top">
              <span class="ui-chip ui-chip--info">{{ log.type }}</span>
              <span class="ui-chip">Confidence {{ log.confidenceLevel }}</span>
            </div>
            <p>{{ log.content }}</p>
            @if (log.notes) {
              <p class="communication-item__notes">{{ log.notes }}</p>
            }
            <span class="communication-item__time">{{ formatDate(log.createdAt) }}</span>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .communication-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 680px;
      line-height: 1.6;
    }

    .communication-today {
      margin-bottom: 16px;
      padding: 16px 18px;
    }

    .communication-today__label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-muted);
      font-size: 0.78rem;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .communication-today h3 {
      margin: 0 0 10px;
      font-size: 1.1rem;
    }

    .communication-today p {
      margin: 0 0 8px;
      color: var(--text-muted);
      line-height: 1.55;
    }

    .communication-today p:last-child {
      margin-bottom: 0;
    }

    .communication-today strong {
      color: var(--text-main);
      font-weight: 600;
    }

    .communication-form {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }

    .communication-form__content,
    .communication-form__notes {
      grid-column: span 2;
    }

    .communication-form .field select,
    .communication-form .field textarea {
      width: 100%;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid var(--metal-border);
      border-radius: 14px;
      background: var(--surface-input);
      color: var(--text-main);
      outline: none;
      font: inherit;
    }

    .communication-form .field textarea {
      min-height: 104px;
      resize: vertical;
    }

    .communication-form .field select:focus,
    .communication-form .field textarea:focus {
      border-color: rgba(var(--a), 0.68);
      box-shadow: 0 0 0 3px rgba(var(--a), 0.12);
    }

    .communication-panel__feedback {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .communication-list {
      display: grid;
      gap: 12px;
    }

    .communication-item {
      padding: 16px 18px;
    }

    .communication-item__top {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }

    .communication-item p {
      margin: 0 0 8px;
      color: var(--text-main);
      line-height: 1.6;
    }

    .communication-item__notes {
      color: var(--text-muted) !important;
      font-size: 0.9rem;
    }

    .communication-item__time {
      color: var(--text-muted);
      font-size: 0.84rem;
    }

    @media (max-width: 820px) {
      .communication-form {
        grid-template-columns: 1fr;
      }

      .communication-form__content,
      .communication-form__notes {
        grid-column: span 1;
      }
    }
  `]
})
export class CommunicationLabComponent {
  readonly types: CommunicationType[] = ['Vocabulary', 'Speaking', 'Conversation', 'Interview', 'Writing'];

  @Input() todayPlan: CommunicationTodayPlan | null = null;
  @Input({ required: true }) recentLogs!: CommunicationLog[];
  @Input({ required: true }) form!: {
    type: CommunicationType;
    content: string;
    confidenceLevel: number;
    notes: string;
  };
  @Input() acknowledgementMessage = '';
  @Input() errorMessage = '';

  @Output() formChange = new EventEmitter<{
    type: CommunicationType;
    content: string;
    confidenceLevel: number;
    notes: string;
  }>();
  @Output() submit = new EventEmitter<void>();

  get isFormValid(): boolean {
    return Boolean(this.form.type && this.form.content.trim() && this.form.confidenceLevel >= 1 && this.form.confidenceLevel <= 5);
  }

  updateField(
    key: 'type' | 'content' | 'confidenceLevel' | 'notes',
    value: string | number
  ): void {
    this.formChange.emit({
      ...this.form,
      [key]: key === 'confidenceLevel' ? this.toNumber(value) : value
    });
  }

  toNumber(value: string | number): number {
    if (typeof value === 'number') {
      return value;
    }

    const parsed = Number.parseInt(value, 10);
    return Number.isNaN(parsed) ? 1 : parsed;
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
