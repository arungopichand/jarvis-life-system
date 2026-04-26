import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Expense } from '../models/expense';

@Component({
  selector: 'app-finance-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="finance-panel">
      <div class="finance-panel__header">
        <div>
          <p class="finance-panel__eyebrow">Money</p>
          <h2>Finance Lab</h2>
          <p class="finance-panel__subtitle">
            Track spending fast, keep categories tidy, and make the daily total easier to review.
          </p>
        </div>

        <div class="finance-panel__total">
          <span>Total Spent Today</span>
          <strong>\${{ totalSpentToday.toFixed(2) }}</strong>
          <p class="finance-panel__budget-note">{{ budgetContextMessage }}</p>
        </div>
      </div>

      <form class="expense-form" (ngSubmit)="addExpense.emit()">
        <label class="field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            [ngModel]="expenseForm.title"
            (ngModelChange)="updateTitle($event)"
            placeholder="Coffee after workout"
          />
        </label>

        <label class="field">
          <span>Amount</span>
          <input
            type="number"
            name="amount"
            [ngModel]="expenseForm.amount"
            (ngModelChange)="updateAmount($event)"
            placeholder="5.99"
            min="0"
            step="0.01"
          />
        </label>

        <label class="field">
          <span>Category</span>
          <input
            type="text"
            name="category"
            [ngModel]="expenseForm.category"
            (ngModelChange)="updateCategory($event)"
            placeholder="Food"
          />
        </label>

        <button type="submit" class="finance-button" [disabled]="!isExpenseFormValid">
          Add Expense
        </button>
      </form>

      @if (errorMessage) {
        <p class="error-message" aria-live="assertive">{{ errorMessage }}</p>
      }

      @if (acknowledgementMessage) {
        <p class="finance-acknowledgement" aria-live="polite">{{ acknowledgementMessage }}</p>
      }

      @if (lastLoggedExpenseTitle) {
        <p class="finance-continuity">Last logged: {{ lastLoggedExpenseTitle }}</p>
      }

      @if (expenses.length === 0) {
        <p class="info-message finance-empty-state" aria-live="polite">No expenses logged yet. Capture each spend as it happens to stay in control.</p>
      }

      <div class="expense-list">
        @for (expense of expenses; track expense.id) {
          <article class="expense-card">
            <div class="expense-card__content">
              <div class="expense-card__top-row">
                <h3>{{ expense.title }}</h3>
                <span class="expense-card__amount">\${{ expense.amount.toFixed(2) }}</span>
              </div>

              <div class="expense-card__meta">
                <span>{{ expense.category }}</span>
              </div>
            </div>

            <button type="button" class="delete-button" (click)="removeExpense.emit(expense.id)">
              Delete
            </button>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .finance-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.65;
    }

    .finance-panel__budget-note {
      margin: 6px 0 0;
      color: var(--text-muted);
      font-size: 0.82rem;
      line-height: 1.5;
    }

    .finance-empty-state {
      margin: 0 0 16px;
    }

    .finance-acknowledgement,
    .finance-continuity {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }

    .expense-card {
      position: relative;
      overflow: hidden;
    }

    .expense-card::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(var(--a), 0.18), transparent 82%);
    }
  `]
})
export class FinanceLabComponent {
  @Input({ required: true }) expenses!: Expense[];
  @Input({ required: true }) expenseForm!: { title: string; amount: number | null; category: string };
  @Input() totalSpentToday = 0;
  @Input() dailySpendingLimit = 0;
  @Input() errorMessage = '';
  @Input() acknowledgementMessage = '';
  @Input() lastLoggedExpenseTitle = '';

  @Output() expenseFormChange = new EventEmitter<{ title: string; amount: number | null; category: string }>();
  @Output() addExpense = new EventEmitter<void>();
  @Output() removeExpense = new EventEmitter<number>();

  get isExpenseFormValid(): boolean {
    return Boolean(
      this.expenseForm.title.trim() &&
      this.expenseForm.amount !== null &&
      this.expenseForm.category.trim()
    );
  }

  get budgetContextMessage(): string {
    const remaining = this.dailySpendingLimit - this.totalSpentToday;

    if (remaining >= 0) {
      return `${remaining.toFixed(2)} remaining in today's budget window.`;
    }

    return `${Math.abs(remaining).toFixed(2)} over today's budget limit.`;
  }

  updateTitle(title: string): void {
    this.expenseFormChange.emit({
      ...this.expenseForm,
      title
    });
  }

  updateAmount(amount: number | null): void {
    this.expenseFormChange.emit({
      ...this.expenseForm,
      amount
    });
  }

  updateCategory(category: string): void {
    this.expenseFormChange.emit({
      ...this.expenseForm,
      category
    });
  }
}
