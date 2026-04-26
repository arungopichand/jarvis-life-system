import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dopamine-control',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="dopamine-panel">
      <div class="dopamine-panel__header">
        <div>
          <p class="dopamine-panel__eyebrow">Focus Defense</p>
          <h2>Dopamine Control</h2>
          <p class="dopamine-panel__subtitle">
            Reduce distraction loops and keep execution ahead of impulse.
          </p>
        </div>

        <article class="dopamine-panel__status-card">
          <span class="dopamine-panel__status-label">System Status</span>
          <strong [class.dopamine-panel__status-value--active]="isDisciplineModeOn">
            {{ dopamineStatus }}
          </strong>
          <span>Streak: {{ dopamineStreakDays }} day{{ dopamineStreakDays === 1 ? '' : 's' }}</span>
        </article>
      </div>

      <article class="dopamine-rules">
        <span class="dopamine-rules__label">Rules</span>

        <ul class="dopamine-rules__list">
          @for (rule of rules; track rule) {
            <li>{{ rule }}</li>
          }
        </ul>
      </article>

      <div class="dopamine-controls">
        <button
          type="button"
          class="dopamine-toggle"
          [class.dopamine-toggle--active]="isDisciplineModeOn"
          (click)="toggleDisciplineMode()"
        >
          {{ isDisciplineModeOn ? 'Dopamine Discipline Mode: ON' : 'Dopamine Discipline Mode: OFF' }}
        </button>

        <button type="button" class="delete-button" (click)="breakDiscipline()">
          I broke discipline
        </button>
      </div>

      @if (feedbackMessage) {
        <p
          class="dopamine-feedback"
          [class.dopamine-feedback--active]="isDisciplineModeOn"
          aria-live="polite"
        >
          {{ feedbackMessage }}
        </p>
      }
    </section>
  `,
  styles: [`
    .dopamine-panel {
      margin-bottom: 24px;
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 24px;
      background:
        radial-gradient(circle at top right, rgba(var(--a), 0.12), transparent 28%),
        radial-gradient(circle at left, rgba(var(--h), 0.1), transparent 24%),
        var(--panel-bg-primary);
      box-shadow: var(--shadow-inset-soft), var(--shadow-elev-strong);
    }

    .dopamine-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 20px;
    }

    .dopamine-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--arc-cyan);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .dopamine-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .dopamine-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .dopamine-panel__status-card {
      display: grid;
      gap: 6px;
      min-width: 220px;
      padding: 14px 16px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--color-surface-inset);
    }

    .dopamine-panel__status-label {
      color: var(--text-muted);
      font-size: 0.76rem;
      letter-spacing: 0.12rem;
      text-transform: uppercase;
    }

    .dopamine-panel__status-card strong {
      color: var(--warning-red);
      font-size: 1rem;
    }

    .dopamine-panel__status-value--active {
      color: var(--success-green) !important;
    }

    .dopamine-rules {
      margin-bottom: 18px;
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--card-bg);
    }

    .dopamine-rules__label {
      display: block;
      margin-bottom: 12px;
      color: var(--reactor-amber);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .dopamine-rules__list {
      display: grid;
      gap: 10px;
      margin: 0;
      padding-left: 18px;
      color: var(--text-main);
    }

    .dopamine-rules__list li {
      line-height: 1.65;
    }

    .dopamine-rules__list li::marker {
      color: var(--arc-cyan);
    }

    .dopamine-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
    }

    .dopamine-toggle {
      padding: 12px 16px;
      border: 1px solid rgba(var(--h), 0.34);
      border-radius: 14px;
      background: rgba(var(--h), 0.08);
      color: var(--text-main);
      font: inherit;
      font-weight: 700;
      cursor: pointer;
    }

    .dopamine-toggle--active {
      border-color: rgba(var(--s), 0.34);
      background: linear-gradient(135deg, rgba(var(--s), 0.18), rgba(var(--a), 0.14));
      box-shadow: 0 0 24px rgba(var(--s), 0.1);
    }

    .dopamine-feedback {
      margin: 0;
      padding: 14px 16px;
      border: 1px solid rgba(var(--d), 0.24);
      border-radius: 16px;
      background: rgba(var(--d), 0.08);
      color: var(--text-main);
      font-weight: 600;
      line-height: 1.6;
    }

    .dopamine-feedback--active {
      border-color: rgba(var(--s), 0.28);
      background: linear-gradient(90deg, rgba(var(--a), 0.12), rgba(var(--s), 0.12));
    }

    @media (max-width: 820px) {
      .dopamine-panel__header {
        flex-direction: column;
      }

      .dopamine-panel__status-card {
        min-width: 0;
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .dopamine-panel {
        padding: 18px;
      }

      .dopamine-controls {
        display: grid;
        grid-template-columns: 1fr;
      }

      .dopamine-controls .dopamine-toggle,
      .dopamine-controls .delete-button {
        width: 100%;
      }
    }
  `]
})
export class DopamineControlComponent {
  readonly rules = [
    'No social media before first mission',
    'No phone during focus timer',
    'No random scrolling'
  ];

  isDisciplineModeOn = false;
  dopamineStreakDays = 0;
  feedbackMessage = 'Distraction risk';

  get dopamineStatus(): string {
    return this.isDisciplineModeOn ? 'High control mode' : 'Distraction risk';
  }

  toggleDisciplineMode(): void {
    this.isDisciplineModeOn = !this.isDisciplineModeOn;

    if (this.isDisciplineModeOn) {
      this.dopamineStreakDays += 1;
      this.feedbackMessage = 'Dopamine locked. Focus only on execution.';
      return;
    }

    this.feedbackMessage = 'Distraction risk';
  }

  breakDiscipline(): void {
    this.isDisciplineModeOn = false;
    this.dopamineStreakDays = 0;
    this.feedbackMessage = 'Reset. Start again. No guilt.';
  }
}
