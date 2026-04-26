import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IncomeLog, IncomeMonthSummary } from '../models/income-log';

@Component({
  selector: 'app-wealth-builder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="wealth-panel">
      <div class="wealth-panel__header">
        <div>
          <p class="wealth-panel__eyebrow">Income First</p>
          <h2>Wealth Builder</h2>
          <p class="wealth-panel__subtitle">
            Build income momentum, track goal progress, and keep expenses as a secondary control layer.
          </p>
        </div>

        <article class="wealth-panel__status-card">
          <span class="wealth-panel__status-label">This Month</span>
          <strong>{{ monthSummary?.totalIncome?.toFixed(2) || '0.00' }}</strong>
          <span>
            Goal progress:
            {{ monthSummary?.goalProgressPercentage?.toFixed(1) || '0.0' }}%
          </span>
        </article>
      </div>

      <div class="wealth-grid">
        <article class="wealth-card ui-card">
          <span class="wealth-card__label">Monthly Goals</span>
          <p>Income goal: {{ monthSummary?.monthlyIncomeGoal?.toFixed(2) || '0.00' }}</p>
          <p>Savings goal: {{ monthSummary?.savingsGoal?.toFixed(2) || '0.00' }}</p>
          <p>{{ skillToIncomeAction }}</p>
          <p>Wealth habit: {{ wealthHabitOfTheDay }}</p>
        </article>

        <article class="wealth-card ui-card">
          <span class="wealth-card__label">Log Income</span>
          <form class="income-form" (ngSubmit)="addIncome.emit()">
            <label class="field">
              <span>Source</span>
              <input
                type="text"
                name="source"
                [ngModel]="incomeForm.source"
                (ngModelChange)="updateField('source', $event)"
                placeholder="Freelance API work"
              />
            </label>
            <label class="field">
              <span>Amount</span>
              <input
                type="number"
                name="amount"
                [ngModel]="incomeForm.amount"
                (ngModelChange)="updateField('amount', $event)"
                min="0.01"
                step="0.01"
              />
            </label>
            <label class="field">
              <span>Notes</span>
              <input
                type="text"
                name="notes"
                [ngModel]="incomeForm.notes"
                (ngModelChange)="updateField('notes', $event)"
                placeholder="Service delivered in 4 hours"
              />
            </label>
            <button type="submit" class="finance-button" [disabled]="!isFormValid">
              Add Income
            </button>
          </form>
        </article>
      </div>

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      @if (acknowledgementMessage) {
        <p class="wealth-panel__feedback">{{ acknowledgementMessage }}</p>
      }

      <div class="income-list">
        @for (entry of recentIncome; track entry.id) {
          <article class="income-item ui-card ui-accent-line">
            <div class="income-item__top">
              <h3>{{ entry.source }}</h3>
              <span class="ui-chip ui-chip--success">{{ entry.amount.toFixed(2) }}</span>
            </div>
            @if (entry.notes) {
              <p>{{ entry.notes }}</p>
            }
            <span class="income-item__time">{{ formatDate(entry.createdAt) }}</span>
          </article>
        }
      </div>

      <div class="wealth-secondary ui-card">
        <span class="wealth-card__label">Expense Control (Secondary)</span>
        <p>
          Spent today: {{ totalSpentToday.toFixed(2) }} / {{ dailySpendingLimit.toFixed(2) }}
        </p>
        <p>{{ moneyStatus }}</p>
      </div>
    </section>
  `,
  styles: [`
    .wealth-panel__feedback {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .wealth-grid {
      margin-bottom: 16px;
    }

    .wealth-card {
      padding: 16px 18px;
      box-shadow: none;
    }

    .wealth-card p {
      margin: 0 0 10px;
      line-height: 1.55;
      color: var(--text-muted);
    }

    .income-form {
      display: grid;
      gap: 10px;
    }

    .income-list {
      display: grid;
      gap: 10px;
      margin-bottom: 16px;
    }

    .income-item {
      padding: 14px 16px;
      box-shadow: none;
    }

    .income-item__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      margin-bottom: 8px;
    }

    .income-item__top h3 {
      margin: 0;
      font-size: 1rem;
    }

    .income-item p {
      margin: 0 0 8px;
      color: var(--text-muted);
      line-height: 1.55;
    }

    .income-item__time {
      color: var(--text-muted);
      font-size: 0.82rem;
    }

    .wealth-secondary {
      padding: 14px 16px;
      box-shadow: none;
    }

    .wealth-secondary p {
      margin: 0 0 8px;
      color: var(--text-muted);
      line-height: 1.55;
    }
  `]
})
export class WealthBuilderComponent {
  @Input() dailySpendingLimit = 0;
  @Input() totalSpentToday = 0;
  @Input() monthSummary: IncomeMonthSummary | null = null;
  @Input() recentIncome: IncomeLog[] = [];
  @Input() incomeForm: { source: string; amount: number | null; notes: string } = {
    source: '',
    amount: null,
    notes: ''
  };
  @Input() errorMessage = '';
  @Input() acknowledgementMessage = '';
  @Input() skillToIncomeAction = 'Turn one skill rep into a monetizable portfolio artifact this week.';
  @Input() wealthHabitOfTheDay = 'Log income signals daily and review weekly progress every Sunday.';

  @Output() incomeFormChange = new EventEmitter<{ source: string; amount: number | null; notes: string }>();
  @Output() addIncome = new EventEmitter<void>();

  get isFormValid(): boolean {
    return Boolean(this.incomeForm.source.trim() && this.incomeForm.amount && this.incomeForm.amount > 0);
  }

  get moneyStatus(): string {
    return this.totalSpentToday <= this.dailySpendingLimit
      ? 'Expense control is within target.'
      : 'Expense limit exceeded. Keep spending intentional for the rest of the day.';
  }

  updateField(key: 'source' | 'amount' | 'notes', value: string | number | null): void {
    this.incomeFormChange.emit({
      ...this.incomeForm,
      [key]: key === 'amount' && typeof value === 'string' ? Number.parseFloat(value) : value
    });
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
