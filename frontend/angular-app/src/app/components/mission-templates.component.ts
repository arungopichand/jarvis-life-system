import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MissionTemplate } from '../models/mission-template';
import { MissionTemplateService } from '../services/mission-template.service';

@Component({
  selector: 'app-mission-templates',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="templates-panel ui-panel">
      <div class="templates-panel__header">
        <div>
          <p class="templates-panel__eyebrow">Templates</p>
          <h2>Mission Templates</h2>
          <p class="templates-panel__subtitle">
            Build reusable mission patterns so tomorrow starts with clear direction.
          </p>
        </div>

        <span class="templates-panel__count ui-chip ui-chip--info">{{ templates.length }} templates</span>
      </div>

      <form class="template-form" (ngSubmit)="submitForm()">
        <label class="field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            [(ngModel)]="templateForm.title"
            placeholder="Morning Workout"
          />
        </label>

        <label class="field">
          <span>Category</span>
          <input
            type="text"
            name="category"
            [(ngModel)]="templateForm.category"
            placeholder="Fitness"
          />
        </label>

        <label class="field">
          <span>XP Reward</span>
          <input
            type="number"
            name="xpReward"
            [(ngModel)]="templateForm.xpReward"
            min="0"
            step="1"
            placeholder="50"
          />
        </label>

        <label class="field template-form__description">
          <span>Description</span>
          <textarea
            name="description"
            [(ngModel)]="templateForm.description"
            rows="3"
            placeholder="Short note about when to use this mission template"
          ></textarea>
        </label>

        <label class="template-checkbox">
          <input
            type="checkbox"
            name="isEnabled"
            [(ngModel)]="templateForm.isEnabled"
          />
          <span>Enabled</span>
        </label>

        <div class="template-form__actions">
          <button type="submit" class="finance-button" [disabled]="!isFormValid()">
            {{ isEditing ? 'Update Template' : 'Create Template' }}
          </button>

          @if (isEditing) {
            <button type="button" class="reset-day-button" (click)="cancelEdit()">
              Cancel
            </button>
          }
        </div>
      </form>

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      @if (successMessage) {
        <p class="success-message">{{ successMessage }}</p>
      }

      @if (isLoading) {
        <p class="info-message" aria-live="polite">Loading mission templates...</p>
      }

      @if (!isLoading && templates.length === 0) {
        <p class="info-message" aria-live="polite">No templates yet. Add a few repeatable missions to make daily planning faster.</p>
      }

      <div class="template-list">
        @for (template of templates; track template.id) {
          <article class="template-card ui-card ui-accent-line" [class.template-card--disabled]="!template.isEnabled">
            <div class="template-card__content">
              <div class="template-card__top-row">
                <div class="template-card__title-group">
                  <h3>{{ template.title }}</h3>
                  <span
                    class="template-status ui-chip"
                    [class.template-status--enabled]="template.isEnabled"
                    [class.template-status--disabled]="!template.isEnabled"
                  >
                    {{ template.isEnabled ? 'Enabled' : 'Disabled' }}
                  </span>
                </div>

                <span class="mission-card__xp ui-chip ui-chip--warning">{{ template.xpReward }} XP</span>
              </div>

              <div class="template-card__meta">
                <span class="ui-chip">{{ template.category }}</span>
                <span class="ui-chip">ID {{ template.id }}</span>
              </div>

              @if (template.description) {
                <p class="template-card__description">{{ template.description }}</p>
              }
            </div>

            <div class="template-card__actions">
              <button type="button" class="reset-day-button" (click)="editTemplate(template)">
                Edit
              </button>

              <button type="button" class="delete-button" (click)="deleteTemplate(template.id)">
                Delete
              </button>
            </div>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .templates-panel {
      padding: 24px;
    }

    .templates-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 20px;
    }

    .templates-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--text-muted);
      letter-spacing: 0.2rem;
      text-transform: uppercase;
      font-size: 0.74rem;
    }

    .templates-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .templates-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 420px;
    }

    .templates-panel__count {
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .template-form {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 20px;
    }

    .field textarea {
      width: 100%;
      min-height: 110px;
      padding: 12px 14px;
      border: 1px solid var(--metal-border);
      border-radius: 14px;
      background: var(--color-surface-inset);
      color: var(--text-main);
      outline: none;
      resize: vertical;
      font: inherit;
    }

    .field textarea:focus {
      border-color: rgba(var(--a), 0.65);
      box-shadow: 0 0 0 3px rgba(var(--a), 0.12);
    }

    .field textarea::placeholder {
      color: var(--text-muted);
    }

    .template-form__description {
      grid-column: span 2;
    }

    .template-checkbox {
      display: flex;
      align-items: center;
      gap: 10px;
      align-self: end;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid var(--color-border-soft);
      border-radius: 14px;
      background: var(--card-bg-muted);
      color: var(--text-main);
    }

    .template-checkbox input {
      width: 18px;
      height: 18px;
      accent-color: var(--color-accent-500);
    }

    .template-form__actions {
      grid-column: 1 / -1;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .success-message {
      margin: 0 0 16px;
      padding: 14px 16px;
      border-radius: 14px;
      color: var(--text-main);
      background: rgba(var(--s), 0.16);
      border: 1px solid rgba(var(--s), 0.2);
    }

    .template-list {
      display: grid;
      gap: 14px;
    }

    .template-card {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 18px 20px;
    }

    .template-card--disabled {
      border-color: rgba(var(--h), 0.18);
      opacity: 0.86;
    }

    .template-card__content {
      flex: 1;
    }

    .template-card__top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      margin-bottom: 10px;
    }

    .template-card__title-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .template-card__title-group h3 {
      margin: 0;
      font-size: 1.08rem;
    }

    .template-status {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.03rem;
      text-transform: uppercase;
    }

    .template-status--enabled {
      border-color: rgba(var(--s), 0.34);
      background: rgba(var(--s), 0.16);
    }

    .template-status--disabled {
      border-color: rgba(var(--h), 0.34);
      background: rgba(var(--h), 0.16);
    }

    .template-card__meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 12px;
      color: var(--text-muted);
      font-size: 0.92rem;
    }

    .template-card__meta span { white-space: nowrap; }

    .template-card__description {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.6;
    }

    .template-card__actions {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: stretch;
    }

    @media (max-width: 820px) {
      .template-form {
        grid-template-columns: 1fr;
      }

      .template-form__description {
        grid-column: span 1;
      }

      .templates-panel__header,
      .template-card,
      .template-card__top-row {
        flex-direction: column;
        align-items: stretch;
      }

      .template-card__title-group {
        align-items: flex-start;
      }

      .template-card__actions {
        flex-direction: row;
      }

      .template-card__actions .reset-day-button,
      .template-card__actions .delete-button {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .templates-panel {
        padding: 18px;
      }

      .template-card__actions {
        flex-direction: column;
      }
    }
  `]
})
export class MissionTemplatesComponent implements OnInit {
  templates: MissionTemplate[] = [];
  isLoading = false;
  isEditing = false;
  errorMessage = '';
  successMessage = '';
  templateForm: MissionTemplate = this.createEmptyForm();

  constructor(private missionTemplateService: MissionTemplateService) {}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.missionTemplateService.getTemplates().subscribe({
      next: (templates) => {
        this.templates = templates;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Could not load mission templates.';
        this.isLoading = false;
      }
    });
  }

  submitForm(): void {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please enter a title, category, and XP reward.';
      this.successMessage = '';
      return;
    }

    this.errorMessage = '';

    if (this.isEditing) {
      this.missionTemplateService.updateTemplate(this.buildTemplatePayload()).subscribe({
        next: () => {
          this.successMessage = 'Mission template updated.';
          this.resetForm();
          this.loadTemplates();
        },
        error: () => {
          this.errorMessage = 'Could not update the mission template.';
        }
      });

      return;
    }

    this.missionTemplateService.createTemplate(this.buildTemplatePayload()).subscribe({
      next: () => {
        this.successMessage = 'Mission template created.';
        this.resetForm();
        this.loadTemplates();
      },
      error: () => {
        this.errorMessage = 'Could not create the mission template.';
      }
    });
  }

  editTemplate(template: MissionTemplate): void {
    this.isEditing = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.templateForm = {
      ...template
    };
  }

  cancelEdit(): void {
    this.resetForm();
    this.errorMessage = '';
    this.successMessage = '';
  }

  deleteTemplate(id: number): void {
    const confirmed = window.confirm('Delete this mission template?');

    if (!confirmed) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.missionTemplateService.deleteTemplate(id).subscribe({
      next: () => {
        if (this.templateForm.id === id) {
          this.resetForm();
        }

        this.successMessage = 'Mission template deleted.';
        this.loadTemplates();
      },
      error: () => {
        this.errorMessage = 'Could not delete the mission template.';
      }
    });
  }

  isFormValid(): boolean {
    return Boolean(
      this.templateForm.title.trim() &&
      this.templateForm.category.trim() &&
      this.templateForm.xpReward >= 0
    );
  }

  private buildTemplatePayload(): MissionTemplate {
    return {
      id: this.templateForm.id,
      title: this.templateForm.title.trim(),
      description: this.templateForm.description?.trim() || undefined,
      xpReward: Number(this.templateForm.xpReward),
      category: this.templateForm.category.trim(),
      isEnabled: this.templateForm.isEnabled
    };
  }

  private resetForm(): void {
    this.isEditing = false;
    this.templateForm = this.createEmptyForm();
  }

  private createEmptyForm(): MissionTemplate {
    return {
      id: 0,
      title: '',
      description: '',
      xpReward: 0,
      category: '',
      isEnabled: true
    };
  }
}
