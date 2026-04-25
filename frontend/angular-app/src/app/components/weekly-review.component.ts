import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { WeeklyStats } from '../models/weekly-stats';

@Component({
  selector: 'app-weekly-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="review-panel">
      <div class="review-panel__header">
        <div>
          <p class="review-panel__eyebrow">Reflection</p>
          <h2>Weekly Review</h2>
        </div>
      </div>

      <div class="review-grid">
        <article class="review-card">
          <span class="review-card__label">Completed This Week</span>
          <strong class="review-card__value">{{ totalCompletedMissionsThisWeek }}</strong>
        </article>

        <article class="review-card">
          <span class="review-card__label">Average Completion %</span>
          <strong class="review-card__value">{{ averageCompletionPercentageThisWeek }}%</strong>
        </article>

        <article class="review-card">
          <span class="review-card__label">Total Spent This Week</span>
          <strong class="review-card__value">\${{ totalSpentThisWeek.toFixed(2) }}</strong>
        </article>
      </div>

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      @if (weeklyStats.length === 0) {
        <p class="info-message">No weekly stats found yet.</p>
      }

      <div class="review-table-wrapper">
        <table class="review-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Total</th>
              <th>Done</th>
              <th>Completion</th>
              <th>Spent</th>
            </tr>
          </thead>
          <tbody>
            @for (day of weeklyStats; track day.date) {
              <tr>
                <td>{{ day.date }}</td>
                <td>{{ day.totalMissions }}</td>
                <td>{{ day.completedMissions }}</td>
                <td>{{ day.completionPercentage }}%</td>
                <td>\${{ day.totalSpent.toFixed(2) }}</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </section>
  `
})
export class WeeklyReviewComponent {
  @Input({ required: true }) weeklyStats!: WeeklyStats[];
  @Input() totalCompletedMissionsThisWeek = 0;
  @Input() averageCompletionPercentageThisWeek = 0;
  @Input() totalSpentThisWeek = 0;
  @Input() errorMessage = '';
}
