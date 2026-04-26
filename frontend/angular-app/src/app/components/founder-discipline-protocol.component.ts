import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-founder-discipline-protocol',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="protocol-panel ui-panel">
      <div class="protocol-panel__header">
        <div>
          <p class="protocol-panel__eyebrow">Discipline System</p>
          <h2>Founder Discipline Protocol</h2>
          <p class="protocol-panel__subtitle">
            A high-output operating mode shaped around first-principles thinking, deep work, and mission execution.
          </p>
        </div>

        <button
          type="button"
          class="protocol-panel__activate ui-btn ui-btn--secondary"
          [class.protocol-panel__activate--active]="isDisciplineModeActive"
          (click)="activateDisciplineMode.emit()"
        >
          {{ isDisciplineModeActive ? 'Discipline Mode Online' : 'Activate Discipline Mode' }}
        </button>
      </div>

      <div class="protocol-grid">
        <article class="protocol-card ui-card protocol-card--primary">
          <span class="protocol-card__label">Biography-Inspired Lessons</span>

          <ul class="protocol-list">
            @for (lesson of lessons; track lesson) {
              <li>{{ lesson }}</li>
            }
          </ul>
        </article>

        <article class="protocol-card ui-card">
          <span class="protocol-card__label">Daily Discipline Rules</span>

          <ul class="protocol-list protocol-list--rules">
            @for (rule of disciplineRules; track rule) {
              <li>{{ rule }}</li>
            }
          </ul>
        </article>
      </div>

      @if (disciplineModeMessage) {
        <p class="protocol-status ui-chip ui-chip--success" aria-live="polite">{{ disciplineModeMessage }}</p>
      }
    </section>
  `,
  styles: [`
    .protocol-panel {
      position: relative;
      margin-bottom: 24px;
      padding: 24px;
      overflow: hidden;
    }

    .protocol-panel__header {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 22px;
    }

    .protocol-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--text-muted);
      font-size: 0.8rem;
      letter-spacing: 0.22rem;
      text-transform: uppercase;
    }

    .protocol-panel__header h2 {
      margin: 0;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      letter-spacing: 0.04rem;
    }

    .protocol-panel__subtitle {
      margin: 12px 0 0;
      max-width: 720px;
      color: var(--text-muted);
      line-height: 1.7;
    }

    .protocol-panel__activate {
      min-width: 220px;
      padding: 14px 18px;
      font: inherit;
      font-weight: 700;
      letter-spacing: 0.03rem;
      cursor: pointer;
    }

    .protocol-panel__activate--active {
      border-color: rgba(var(--s), 0.44);
      background:
        linear-gradient(135deg, rgba(var(--s), 0.22), rgba(var(--a), 0.2));
      box-shadow: var(--glow-success);
    }

    .protocol-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.95fr);
      gap: 16px;
    }

    .protocol-card {
      padding: 18px 20px;
      border-radius: 22px;
    }

    .protocol-card--primary {
      border-color: rgba(var(--a), 0.3);
    }

    .protocol-card__label {
      display: block;
      margin-bottom: 14px;
      color: var(--reactor-amber);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1rem;
      text-transform: uppercase;
    }

    .protocol-list {
      display: grid;
      gap: 12px;
      margin: 0;
      padding-left: 18px;
      color: var(--text-main);
    }

    .protocol-list li {
      line-height: 1.65;
    }

    .protocol-list--rules li::marker {
      color: var(--arc-cyan);
    }

    .protocol-status {
      position: relative;
      z-index: 1;
      margin: 16px 0 0;
      padding: 12px 14px;
      font-weight: 700;
      letter-spacing: 0.02rem;
    }

    @media (max-width: 820px) {
      .protocol-panel__header {
        flex-direction: column;
        align-items: stretch;
      }

      .protocol-panel__activate {
        width: 100%;
        min-width: 0;
      }

      .protocol-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .protocol-panel {
        padding: 18px;
      }
    }
  `]
})
export class FounderDisciplineProtocolComponent {
  readonly lessons = [
    'Build things, don\'t just consume content.',
    'Work from first principles: break problems down.',
    'Focus on hard problems.',
    'Measure output, not mood.',
    'Learn fast, ship fast, improve fast.',
    'Use time blocks for deep work.',
    'Avoid comfort addiction.'
  ];

  readonly disciplineRules = [
    '25 minutes deep work',
    '1 health mission',
    '1 money check',
    '1 communication practice',
    '1 skill-building mission'
  ];

  @Input() isDisciplineModeActive = false;
  @Input() disciplineModeMessage = '';

  @Output() activateDisciplineMode = new EventEmitter<void>();
}
