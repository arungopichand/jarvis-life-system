import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wealth-builder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="wealth-panel">
      <div class="wealth-panel__header">
        <div>
          <p class="wealth-panel__eyebrow">Money Systems</p>
          <h2>Wealth Builder</h2>
          <p class="wealth-panel__subtitle">
            Keep daily money actions visible, reinforce one wealth principle, and protect spending discipline.
          </p>
        </div>

        <article class="wealth-panel__status-card">
          <span class="wealth-panel__status-label">Control Status</span>
          <strong [class.wealth-panel__status-value--warning]="totalSpentToday > dailySpendingLimit">
            {{ moneyStatus }}
          </strong>
          <span>Spent today: {{ totalSpentToday.toFixed(2) }} / {{ dailySpendingLimit.toFixed(2) }}</span>
        </article>
      </div>

      <div class="wealth-grid">
        <article class="wealth-card">
          <span class="wealth-card__label">Daily Money Actions</span>

          <ul class="wealth-list">
            @for (action of dailyActions; track action) {
              <li>{{ action }}</li>
            }
          </ul>
        </article>

        <article class="wealth-card wealth-card--lesson">
          <span class="wealth-card__label">Daily Wealth Lesson</span>
          <p class="wealth-lesson">{{ currentLesson }}</p>
          <button type="button" class="training-button" (click)="showNewLesson()">
            New Wealth Lesson
          </button>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .wealth-panel {
      margin-bottom: 24px;
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 24px;
      background:
        radial-gradient(circle at top right, rgba(255, 179, 71, 0.12), transparent 28%),
        radial-gradient(circle at left, rgba(57, 214, 255, 0.1), transparent 24%),
        linear-gradient(180deg, rgba(18, 22, 30, 0.97), rgba(9, 11, 16, 0.99));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 46px rgba(0, 0, 0, 0.22);
    }

    .wealth-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 20px;
    }

    .wealth-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--arc-cyan);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .wealth-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .wealth-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .wealth-panel__status-card {
      display: grid;
      gap: 6px;
      min-width: 260px;
      padding: 14px 16px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: rgba(17, 21, 27, 0.88);
    }

    .wealth-panel__status-label {
      color: var(--text-muted);
      font-size: 0.76rem;
      letter-spacing: 0.12rem;
      text-transform: uppercase;
    }

    .wealth-panel__status-card strong {
      color: var(--success-green);
      font-size: 1rem;
    }

    .wealth-panel__status-value--warning {
      color: var(--warning-red) !important;
    }

    .wealth-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .wealth-card {
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: rgba(18, 22, 29, 0.9);
    }

    .wealth-card--lesson {
      display: flex;
      flex-direction: column;
      gap: 14px;
      justify-content: space-between;
    }

    .wealth-card__label {
      display: block;
      margin-bottom: 12px;
      color: var(--reactor-amber);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .wealth-list {
      display: grid;
      gap: 10px;
      margin: 0;
      padding-left: 18px;
      color: var(--text-main);
    }

    .wealth-list li {
      line-height: 1.65;
    }

    .wealth-list li::marker {
      color: var(--arc-cyan);
    }

    .wealth-lesson {
      margin: 0;
      color: var(--text-main);
      font-size: 1.02rem;
      line-height: 1.7;
    }

    @media (max-width: 820px) {
      .wealth-panel__header {
        flex-direction: column;
      }

      .wealth-panel__status-card {
        min-width: 0;
        width: 100%;
      }

      .wealth-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .wealth-panel {
        padding: 18px;
      }

      .wealth-card--lesson .training-button {
        width: 100%;
      }
    }
  `]
})
export class WealthBuilderComponent {
  private readonly lessons = [
    'Assets put money in your pocket.',
    'Liabilities take money out of your pocket.',
    'Save first, spend after.',
    'Skill growth increases earning power.',
    'Avoid lifestyle inflation.'
  ];

  @Input() dailySpendingLimit = 0;
  @Input() totalSpentToday = 0;

  lessonIndex = 0;

  readonly dailyActions = [
    'Track today\'s expenses',
    'Stay under daily spending limit',
    'Learn one wealth concept',
    'Avoid impulse buying'
  ];

  get currentLesson(): string {
    return this.lessons[this.lessonIndex];
  }

  get moneyStatus(): string {
    return this.totalSpentToday <= this.dailySpendingLimit
      ? 'Money control active.'
      : 'Spending limit exceeded. Pause purchases.';
  }

  showNewLesson(): void {
    this.lessonIndex = (this.lessonIndex + 1) % this.lessons.length;
  }
}
