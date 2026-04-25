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
        </div>

        <div class="finance-panel__total">
          <span>Total Spent Today</span>
          <strong>\${{ totalSpentToday.toFixed(2) }}</strong>
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
            placeholder="Coffee"
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

        <button type="submit" class="finance-button">Add</button>
      </form>

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      @if (expenses.length === 0) {
        <p class="info-message">No expenses logged for today yet.</p>
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
  `
})
export class FinanceLabComponent {
  @Input({ required: true }) expenses!: Expense[];
  @Input({ required: true }) expenseForm!: { title: string; amount: number | null; category: string };
  @Input() totalSpentToday = 0;
  @Input() errorMessage = '';

  @Output() expenseFormChange = new EventEmitter<{ title: string; amount: number | null; category: string }>();
  @Output() addExpense = new EventEmitter<void>();
  @Output() removeExpense = new EventEmitter<number>();

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
