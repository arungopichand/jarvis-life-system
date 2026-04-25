import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSettings } from '../models/user-settings';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="finance-panel">
      <div class="finance-panel__header">
        <div>
          <p class="finance-panel__eyebrow">Profile</p>
          <h2>User Settings</h2>
        </div>
      </div>

      <form
        style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:20px;"
        (ngSubmit)="save.emit()"
      >
        <label class="field">
          <span>Daily Spending Limit</span>
          <input
            type="number"
            name="dailySpendingLimit"
            [(ngModel)]="settings.dailySpendingLimit"
            min="0"
            step="0.01"
          />
        </label>

        <label class="field">
          <span>Main Skill</span>
          <input
            type="text"
            name="mainSkill"
            [(ngModel)]="settings.mainSkill"
            placeholder=".NET"
          />
        </label>

        <label class="field">
          <span>Gym Minutes Target</span>
          <input
            type="number"
            name="gymMinutesTarget"
            [(ngModel)]="settings.gymMinutesTarget"
            min="0"
          />
        </label>

        <label class="field">
          <span>Protein Grams Target</span>
          <input
            type="number"
            name="proteinGramsTarget"
            [(ngModel)]="settings.proteinGramsTarget"
            min="0"
          />
        </label>

        <button type="submit" class="finance-button">Save Settings</button>
      </form>

      @if (successMessage) {
        <p class="info-message">{{ successMessage }}</p>
      }

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }
    </section>
  `
})
export class UserSettingsComponent {
  @Input({ required: true }) settings!: UserSettings;
  @Input() successMessage = '';
  @Input() errorMessage = '';

  @Output() save = new EventEmitter<void>();
}
