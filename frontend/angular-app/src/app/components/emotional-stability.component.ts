import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

type EmotionalState = 'Calm' | 'Angry' | 'Sad' | 'Stressed' | 'Overthinking';

@Component({
  selector: 'app-emotional-stability',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="emotion-panel">
      <div class="emotion-panel__header">
        <div>
          <p class="emotion-panel__eyebrow">Mind Systems</p>
          <h2>Emotional Stability</h2>
          <p class="emotion-panel__subtitle">
            Check your current state quickly, then use one grounded response instead of drifting into reaction.
          </p>
        </div>
      </div>

      <div class="emotion-options">
        @for (state of emotionalStates; track state) {
          <button
            type="button"
            class="emotion-option"
            [class.emotion-option--active]="selectedState === state"
            (click)="selectState(state)"
          >
            {{ state }}
          </button>
        }
      </div>

      <article class="emotion-guidance">
        <span class="emotion-guidance__label">Grounding Action</span>
        <p>{{ currentGuidance }}</p>
      </article>

      <div class="emotion-actions">
        <button type="button" class="finance-button" (click)="resetMind()">
          Reset Mind
        </button>
      </div>

      @if (resetMessage) {
        <p class="emotion-reset-message" aria-live="polite">
          {{ resetMessage }}
        </p>
      }
    </section>
  `,
  styles: [`
    .emotion-panel {
      margin-bottom: 24px;
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 24px;
      background:
        radial-gradient(circle at top right, rgba(var(--a), 0.1), transparent 28%),
        radial-gradient(circle at left, rgba(var(--h), 0.1), transparent 24%),
        var(--panel-bg-primary);
      box-shadow: var(--shadow-inset-soft), var(--shadow-elev-strong);
    }

    .emotion-panel__header {
      margin-bottom: 20px;
    }

    .emotion-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--arc-cyan);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .emotion-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .emotion-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .emotion-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 18px;
    }

    .emotion-option {
      padding: 12px 16px;
      border: 1px solid rgba(var(--a), 0.2);
      border-radius: 999px;
      background: var(--card-bg-muted);
      color: var(--text-main);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
    }

    .emotion-option--active {
      border-color: rgba(var(--h), 0.3);
      background: linear-gradient(135deg, rgba(var(--a), 0.18), rgba(var(--h), 0.14));
      box-shadow: 0 0 0 1px rgba(var(--h), 0.08);
    }

    .emotion-guidance {
      margin-bottom: 18px;
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--card-bg);
    }

    .emotion-guidance__label {
      display: block;
      margin-bottom: 10px;
      color: var(--reactor-amber);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .emotion-guidance p {
      margin: 0;
      color: var(--text-main);
      line-height: 1.65;
      font-size: 1rem;
    }

    .emotion-actions {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    .emotion-reset-message {
      margin: 0;
      padding: 14px 16px;
      border: 1px solid rgba(var(--a), 0.26);
      border-radius: 16px;
      background: linear-gradient(90deg, rgba(var(--a), 0.12), rgba(var(--s), 0.12));
      color: var(--text-main);
      font-weight: 600;
      line-height: 1.6;
    }

    @media (max-width: 640px) {
      .emotion-panel {
        padding: 18px;
      }

      .emotion-options,
      .emotion-actions {
        display: grid;
        grid-template-columns: 1fr;
      }

      .emotion-actions .finance-button {
        width: 100%;
      }
    }
  `]
})
export class EmotionalStabilityComponent {
  readonly emotionalStates: EmotionalState[] = ['Calm', 'Angry', 'Sad', 'Stressed', 'Overthinking'];

  readonly groundingActions: Record<EmotionalState, string> = {
    Calm: 'Protect this state. Continue with your next mission.',
    Angry: 'Pause. Do not react. Take 10 slow breaths.',
    Sad: 'Do one small task. Movement first, mood later.',
    Stressed: 'Write down the next one action only.',
    Overthinking: 'Stop planning. Execute the smallest step.'
  };

  selectedState: EmotionalState | null = null;
  resetMessage = '';

  get currentGuidance(): string {
    if (!this.selectedState) {
      return 'Select one state to get your grounding action.';
    }

    return this.groundingActions[this.selectedState];
  }

  selectState(state: EmotionalState): void {
    this.selectedState = state;
    this.resetMessage = '';
  }

  resetMind(): void {
    this.selectedState = null;
    this.resetMessage = 'Breath. Relax shoulders. Start one small action.';
  }
}
