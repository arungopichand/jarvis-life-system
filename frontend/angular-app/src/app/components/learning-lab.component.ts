import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  LearningCategory,
  LearningLog,
  LearningRoadmap,
  LearningTodayPlan,
  LearningTopicStatus
} from '../models/learning-log';

@Component({
  selector: 'app-learning-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="training-panel learning-panel">
      <div class="training-panel__header">
        <div>
          <p class="training-panel__eyebrow">Learning Command</p>
          <h2>.NET and Full-Stack Roadmap</h2>
          <p class="learning-panel__subtitle">
            Use one guided topic per day, then update roadmap confidence based on real practice.
          </p>
        </div>
      </div>

      <div class="learning-today ui-card ui-accent-line">
        <span class="learning-today__label">Today's Topic</span>
        <h3>{{ todayPlan?.topic || 'Loading learning topic...' }}</h3>
        <div class="learning-today__meta">
          <span class="ui-chip">{{ todayPlan?.category || 'Roadmap' }}</span>
          <span class="ui-chip ui-chip--info">{{ todayPlan?.todayLogCount ?? 0 }} log{{ (todayPlan?.todayLogCount ?? 0) === 1 ? '' : 's' }} today</span>
        </div>
        <p>{{ todayPlan?.practicePrompt }}</p>
      </div>

      <form class="learning-form" (ngSubmit)="submit.emit()">
        <label class="field">
          <span>Topic</span>
          <input
            type="text"
            name="topic"
            [ngModel]="form.topic"
            (ngModelChange)="updateField('topic', $event)"
            placeholder="Middleware ordering and exception handling"
          />
        </label>

        <label class="field">
          <span>Category</span>
          <select
            name="category"
            [ngModel]="form.category"
            (ngModelChange)="updateField('category', $event)"
          >
            @for (option of categories; track option) {
              <option [ngValue]="option">{{ option }}</option>
            }
          </select>
        </label>

        <label class="field">
          <span>Difficulty (1-5)</span>
          <input
            type="number"
            name="difficulty"
            [ngModel]="form.difficulty"
            (ngModelChange)="updateField('difficulty', $event)"
            min="1"
            max="5"
            step="1"
          />
        </label>

        <label class="field learning-form__notes">
          <span>Notes</span>
          <textarea
            name="notes"
            [ngModel]="form.notes"
            (ngModelChange)="updateField('notes', $event)"
            rows="3"
            placeholder="What you learned, what was hard, and what to practice next."
          ></textarea>
        </label>

        <button type="submit" class="finance-button" [disabled]="!isFormValid">
          Log Learning
        </button>
      </form>

      @if (acknowledgementMessage) {
        <p class="learning-panel__feedback" aria-live="polite">{{ acknowledgementMessage }}</p>
      }

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      <div class="roadmap-list">
        @for (category of roadmap?.categories || []; track category.name) {
          <article class="roadmap-category ui-card">
            <header>
              <h3>{{ category.name }}</h3>
            </header>
            <div class="roadmap-topics">
              @for (topic of category.topics; track topic.topic) {
                <div class="roadmap-topic">
                  <div class="roadmap-topic__top">
                    <strong>{{ topic.topic }}</strong>
                    <span class="ui-chip">{{ topic.status }}</span>
                  </div>
                  <div class="roadmap-topic__controls">
                    <select
                      [ngModel]="topic.status"
                      (ngModelChange)="markTopicProgress.emit({
                        topic: topic.topic,
                        category: category.name,
                        status: $event,
                        confidenceLevel: topic.confidenceLevel
                      })"
                    >
                      <option [ngValue]="'NotStarted'">NotStarted</option>
                      <option [ngValue]="'InProgress'">InProgress</option>
                      <option [ngValue]="'Completed'">Completed</option>
                    </select>
                    <label class="roadmap-topic__confidence">
                      <span>Confidence</span>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="1"
                        [ngModel]="topic.confidenceLevel"
                        (ngModelChange)="markTopicProgress.emit({
                          topic: topic.topic,
                          category: category.name,
                          status: topic.status,
                          confidenceLevel: toNumber($event)
                        })"
                      />
                    </label>
                  </div>
                </div>
              }
            </div>
          </article>
        }
      </div>

      <div class="learning-list">
        @for (log of recentLogs; track log.id) {
          <article class="learning-item ui-card ui-accent-line">
            <div class="learning-item__top">
              <h3>{{ log.topic }}</h3>
              <span class="ui-chip ui-chip--info">Difficulty {{ log.difficulty }}</span>
            </div>
            <div class="learning-item__meta">
              <span class="ui-chip">{{ log.category }}</span>
              <span class="ui-chip">{{ formatDate(log.createdAt) }}</span>
            </div>
            @if (log.notes) {
              <p>{{ log.notes }}</p>
            }
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .learning-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 700px;
      line-height: 1.6;
    }

    .learning-today {
      margin-bottom: 16px;
      padding: 16px 18px;
    }

    .learning-today__label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-muted);
      font-size: 0.78rem;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .learning-today h3 {
      margin: 0 0 10px;
      font-size: 1.1rem;
    }

    .learning-today__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }

    .learning-today p {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.55;
    }

    .learning-form {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }

    .learning-form__notes {
      grid-column: span 2;
    }

    .learning-form .field select,
    .learning-form .field textarea {
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

    .learning-form .field textarea {
      min-height: 104px;
      resize: vertical;
    }

    .learning-form .field select:focus,
    .learning-form .field textarea:focus {
      border-color: rgba(var(--a), 0.68);
      box-shadow: 0 0 0 3px rgba(var(--a), 0.12);
    }

    .learning-panel__feedback {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .roadmap-list {
      display: grid;
      gap: 12px;
      margin-bottom: 16px;
    }

    .roadmap-category {
      padding: 14px 16px;
    }

    .roadmap-category header h3 {
      margin: 0 0 10px;
      font-size: 1rem;
    }

    .roadmap-topics {
      display: grid;
      gap: 10px;
    }

    .roadmap-topic {
      padding: 10px 12px;
      border: 1px solid var(--color-border-soft);
      border-radius: 12px;
      background: var(--card-bg-muted);
    }

    .roadmap-topic__top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 8px;
    }

    .roadmap-topic__top strong {
      font-size: 0.94rem;
      line-height: 1.5;
    }

    .roadmap-topic__controls {
      display: grid;
      grid-template-columns: 180px 180px;
      gap: 10px;
      align-items: end;
    }

    .roadmap-topic__controls select,
    .roadmap-topic__confidence input {
      width: 100%;
      min-height: 42px;
      padding: 10px 12px;
      border: 1px solid var(--metal-border);
      border-radius: 10px;
      background: var(--surface-input);
      color: var(--text-main);
      font: inherit;
    }

    .roadmap-topic__confidence {
      display: grid;
      gap: 6px;
    }

    .roadmap-topic__confidence span {
      color: var(--text-muted);
      font-size: 0.78rem;
    }

    .learning-list {
      display: grid;
      gap: 12px;
    }

    .learning-item {
      padding: 16px 18px;
    }

    .learning-item__top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 10px;
    }

    .learning-item__top h3 {
      margin: 0;
      font-size: 1rem;
    }

    .learning-item__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 10px;
    }

    .learning-item p {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.6;
    }

    @media (max-width: 820px) {
      .learning-form {
        grid-template-columns: 1fr;
      }

      .learning-form__notes {
        grid-column: span 1;
      }

      .roadmap-topic__controls {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class LearningLabComponent {
  readonly categories: LearningCategory[] = ['CSharp', 'DotNet', 'AspNetCore', 'Sql', 'Angular', 'TypeScript', 'SystemDesign', 'GitHub'];

  @Input() todayPlan: LearningTodayPlan | null = null;
  @Input() roadmap: LearningRoadmap | null = null;
  @Input({ required: true }) recentLogs!: LearningLog[];
  @Input({ required: true }) form!: {
    topic: string;
    category: LearningCategory;
    notes: string;
    difficulty: number;
  };
  @Input() acknowledgementMessage = '';
  @Input() errorMessage = '';

  @Output() formChange = new EventEmitter<{
    topic: string;
    category: LearningCategory;
    notes: string;
    difficulty: number;
  }>();
  @Output() submit = new EventEmitter<void>();
  @Output() markTopicProgress = new EventEmitter<{
    topic: string;
    category: LearningCategory;
    status: LearningTopicStatus;
    confidenceLevel: number;
  }>();

  get isFormValid(): boolean {
    return Boolean(this.form.topic.trim() && this.form.category && this.form.difficulty >= 1 && this.form.difficulty <= 5);
  }

  updateField(
    key: 'topic' | 'category' | 'notes' | 'difficulty',
    value: string | number
  ): void {
    this.formChange.emit({
      ...this.form,
      [key]: key === 'difficulty' ? this.toNumber(value) : value
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
