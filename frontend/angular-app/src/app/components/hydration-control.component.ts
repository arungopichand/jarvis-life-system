import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-hydration-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="hydration-panel ui-panel">
      <div class="hydration-panel__header">
        <div>
          <p class="hydration-panel__eyebrow">Body Systems</p>
          <h2>Hydration Control</h2>
          <p class="hydration-panel__subtitle">
            Daily target: 3 liters across 8 glasses. Keep water intake visible and easy to update.
          </p>
        </div>

        <article class="hydration-panel__target ui-card ui-card--inset">
          <span class="hydration-panel__target-label">Daily Target</span>
          <strong>3 Liters / 8 Glasses</strong>
        </article>
      </div>

      <div class="hydration-grid">
          <article class="hydration-card ui-card hydration-card--primary">
          <span class="hydration-card__label">Glasses Completed</span>
          <strong class="hydration-card__value">{{ glassesCompleted }} / {{ targetGlasses }}</strong>
        </article>

          <article class="hydration-card ui-card">
          <span class="hydration-card__label">Progress</span>
          <strong class="hydration-card__value">{{ progressPercentage }}%</strong>
        </article>

          <article class="hydration-card ui-card">
          <span class="hydration-card__label">Remaining Glasses</span>
          <strong class="hydration-card__value">{{ remainingGlasses }}</strong>
        </article>
      </div>

      <article class="hydration-status ui-card">
        <span class="hydration-status__label">Hydration Status</span>
        <p>{{ hydrationStatusMessage }}</p>
      </article>

      <div class="hydration-actions">
        <button type="button" class="finance-button" (click)="addGlass()" [disabled]="glassesCompleted >= targetGlasses">
          Add 1 Glass
        </button>

        <button type="button" class="reset-day-button" (click)="resetWater()">
          Reset Water
        </button>
      </div>
    </section>
  `,
  styles: [`
    .hydration-panel {
      margin-bottom: 24px;
      padding: 24px;
    }

    .hydration-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 20px;
    }

    .hydration-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--arc-cyan);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .hydration-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .hydration-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .hydration-panel__target {
      display: grid;
      gap: 6px;
      min-width: 220px;
      padding: 14px 16px;
    }

    .hydration-panel__target-label {
      color: var(--text-muted);
      font-size: 0.76rem;
      letter-spacing: 0.12rem;
      text-transform: uppercase;
    }

    .hydration-panel__target strong {
      color: var(--reactor-amber);
      font-size: 1rem;
    }

    .hydration-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin-bottom: 18px;
    }

    .hydration-card {
      padding: 18px 20px;
    }

    .hydration-card--primary {
      border-color: rgba(var(--a), 0.3);
      box-shadow: 0 0 0 1px rgba(var(--a), 0.08);
    }

    .hydration-card__label,
    .hydration-status__label {
      display: block;
      margin-bottom: 10px;
      color: var(--reactor-amber);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .hydration-card__value {
      color: var(--text-main);
      font-size: clamp(1.5rem, 4vw, 2.1rem);
      font-weight: 700;
    }

    .hydration-status {
      margin-bottom: 18px;
      padding: 18px 20px;
    }

    .hydration-status p {
      margin: 0;
      color: var(--text-main);
      line-height: 1.65;
      font-size: 1rem;
    }

    .hydration-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    @media (max-width: 820px) {
      .hydration-panel__header {
        flex-direction: column;
      }

      .hydration-panel__target {
        min-width: 0;
        width: 100%;
      }

      .hydration-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .hydration-panel {
        padding: 18px;
      }

      .hydration-actions {
        display: grid;
        grid-template-columns: 1fr;
      }

      .hydration-actions .finance-button,
      .hydration-actions .reset-day-button {
        width: 100%;
      }
    }
  `]
})
export class HydrationControlComponent {
  readonly targetLiters = 3;
  readonly targetGlasses = 8;

  glassesCompleted = 0;

  get progressPercentage(): number {
    return Math.round((this.glassesCompleted / this.targetGlasses) * 100);
  }

  get remainingGlasses(): number {
    return Math.max(this.targetGlasses - this.glassesCompleted, 0);
  }

  get hydrationStatusMessage(): string {
    if (this.glassesCompleted === 0) {
      return 'Start hydration. Drink one glass now.';
    }

    if (this.glassesCompleted <= 3) {
      return 'Good start. Keep water nearby.';
    }

    if (this.glassesCompleted <= 7) {
      return 'Hydration on track.';
    }

    return 'Hydration target complete.';
  }

  addGlass(): void {
    if (this.glassesCompleted >= this.targetGlasses) {
      return;
    }

    this.glassesCompleted += 1;
  }

  resetWater(): void {
    this.glassesCompleted = 0;
  }
}
