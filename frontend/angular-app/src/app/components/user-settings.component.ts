import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { UserSettings } from '../models/user-settings';

@Component({
  selector: 'app-user-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="finance-panel settings-panel">
      <div class="finance-panel__header settings-panel__header">
        <div>
          <p class="finance-panel__eyebrow">Profile</p>
          <h2>User Settings</h2>
          <p class="settings-panel__subtitle">
            Keep your limits and personal targets visible so the dashboard guidance stays useful.
          </p>
        </div>
      </div>

      <form class="settings-form" (ngSubmit)="save.emit()">
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

        <div class="settings-form__actions">
          <button type="submit" class="finance-button">Save Settings</button>
        </div>
      </form>

      @if (successMessage) {
        <p class="success-message">{{ successMessage }}</p>
      }

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }
    </section>
  `,
  styles: [`
    .settings-panel {
      position: relative;
      overflow: hidden;
    }

    .settings-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .settings-form {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .settings-form__actions {
      display: flex;
      align-items: flex-end;
    }

    .success-message {
      margin: 0 0 16px;
      padding: 14px 16px;
      border-radius: 14px;
      color: var(--text-main);
      background: rgba(var(--s), 0.16);
      border: 1px solid rgba(var(--s), 0.2);
    }

    @media (max-width: 820px) {
      .settings-form__actions {
        grid-column: 1 / -1;
      }

      .settings-form__actions .finance-button {
        width: 100%;
      }
    }
  `]
})
export class UserSettingsComponent {
  @Input({ required: true }) settings!: UserSettings;
  @Input() successMessage = '';
  @Input() errorMessage = '';

  @Output() save = new EventEmitter<void>();
}
