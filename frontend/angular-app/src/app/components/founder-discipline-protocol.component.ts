import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-founder-discipline-protocol',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="protocol-panel">
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
          class="protocol-panel__activate"
          [class.protocol-panel__activate--active]="isDisciplineModeActive"
          (click)="activateDisciplineMode.emit()"
        >
          {{ isDisciplineModeActive ? 'Discipline Mode Online' : 'Activate Discipline Mode' }}
        </button>
      </div>

      <div class="protocol-grid">
        <article class="protocol-card protocol-card--primary">
          <span class="protocol-card__label">Biography-Inspired Lessons</span>

          <ul class="protocol-list">
            @for (lesson of lessons; track lesson) {
              <li>{{ lesson }}</li>
            }
          </ul>
        </article>

        <article class="protocol-card">
          <span class="protocol-card__label">Daily Discipline Rules</span>

          <ul class="protocol-list protocol-list--rules">
            @for (rule of disciplineRules; track rule) {
              <li>{{ rule }}</li>
            }
          </ul>
        </article>
      </div>

      @if (disciplineModeMessage) {
        <p class="protocol-status" aria-live="polite">{{ disciplineModeMessage }}</p>
      }
    </section>
  `,
  styles: [`
    .protocol-panel {
      position: relative;
      margin-bottom: 24px;
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 28px;
      background:
        radial-gradient(circle at top right, rgba(255, 179, 71, 0.18), transparent 32%),
        radial-gradient(circle at left, rgba(57, 214, 255, 0.14), transparent 28%),
        linear-gradient(180deg, rgba(20, 24, 31, 0.96), rgba(9, 11, 16, 0.99));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        0 22px 58px rgba(0, 0, 0, 0.32),
        0 0 32px rgba(57, 214, 255, 0.12);
      overflow: hidden;
    }

    .protocol-panel::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.03) 48%, transparent 100%);
      opacity: 0.5;
      pointer-events: none;
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
      color: var(--arc-cyan);
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
      border: 1px solid rgba(255, 179, 71, 0.45);
      border-radius: 16px;
      background:
        linear-gradient(135deg, rgba(255, 179, 71, 0.26), rgba(57, 214, 255, 0.14));
      color: var(--text-main);
      font: inherit;
      font-weight: 700;
      letter-spacing: 0.03rem;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .protocol-panel__activate:hover {
      transform: translateY(-1px);
      box-shadow: 0 0 24px rgba(255, 179, 71, 0.26);
    }

    .protocol-panel__activate--active {
      border-color: rgba(66, 245, 158, 0.44);
      background:
        linear-gradient(135deg, rgba(66, 245, 158, 0.22), rgba(57, 214, 255, 0.2));
      box-shadow: 0 0 24px rgba(66, 245, 158, 0.18);
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
      border: 1px solid rgba(142, 152, 168, 0.34);
      border-radius: 22px;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01)),
        rgba(17, 21, 27, 0.94);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
    }

    .protocol-card--primary {
      border-color: rgba(57, 214, 255, 0.3);
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
      padding: 14px 16px;
      border: 1px solid rgba(66, 245, 158, 0.34);
      border-radius: 16px;
      background: linear-gradient(90deg, rgba(57, 214, 255, 0.16), rgba(66, 245, 158, 0.14));
      color: var(--text-main);
      font-weight: 700;
      letter-spacing: 0.02rem;
      box-shadow: 0 0 24px rgba(66, 245, 158, 0.1);
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
