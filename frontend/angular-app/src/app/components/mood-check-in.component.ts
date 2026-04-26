import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type MoodOption = 'Focused' | 'Lazy' | 'Tired' | 'Anxious' | 'Confident';

@Component({
  selector: 'app-mood-check-in',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="mood-panel">
      <div class="mood-panel__header">
        <div>
          <p class="mood-panel__eyebrow">Status</p>
          <h2>Mood Check-In</h2>
          <p class="mood-panel__subtitle">
            Pick your current state so guidance can match your energy, not just your to-do list.
          </p>
        </div>
      </div>

      <div class="mood-options">
        @for (mood of moods; track mood) {
          <button
            type="button"
            class="mood-option"
            [class.mood-option--active]="selectedMood === mood"
            (click)="selectMood(mood)"
          >
            {{ mood }}
          </button>
        }
      </div>

      @if (selectedMood) {
        <article class="mood-guidance">
          <span class="mood-guidance__label">Guidance</span>
          <p>{{ guidanceByMood[selectedMood] }}</p>
        </article>
      } @else {
        <p class="info-message" aria-live="polite">Select one mood to unlock a context-aware next step.</p>
      }
    </section>
  `,
  styles: [`
    .mood-panel {
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 24px;
      background:
        radial-gradient(circle at top left, rgba(var(--a), 0.12), transparent 32%),
        var(--panel-bg-primary);
      box-shadow: var(--shadow-inset-subtle), var(--shadow-elev-strong);
    }

    .mood-panel__header {
      margin-bottom: 20px;
    }

    .mood-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--accent);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .mood-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .mood-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .mood-options {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 18px;
    }

    .mood-option {
      padding: 12px 16px;
      border: 1px solid rgba(var(--a), 0.2);
      border-radius: 999px;
      background: var(--card-bg-muted);
      color: var(--text-main);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-interactive);
    }

    .mood-option:hover {
      transform: translateY(-1px);
      border-color: rgba(var(--a), 0.45);
      background: rgba(var(--a), 0.08);
    }

    .mood-option--active {
      border-color: rgba(var(--h), 0.3);
      background: linear-gradient(135deg, rgba(var(--a), 0.18), rgba(var(--h), 0.14));
      box-shadow: 0 0 0 1px rgba(var(--h), 0.08);
    }

    .mood-guidance {
      position: relative;
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--card-bg);
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    .mood-guidance::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: var(--line-accent-mid);
    }

    .mood-guidance__label {
      display: block;
      margin-bottom: 10px;
      color: var(--accent);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .mood-guidance p {
      margin: 0;
      color: var(--text-main);
      line-height: 1.7;
    }

    @media (max-width: 640px) {
      .mood-panel {
        padding: 18px;
      }

      .mood-options {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  `]
})
export class MoodCheckInComponent {
  readonly moods: MoodOption[] = ['Focused', 'Lazy', 'Tired', 'Anxious', 'Confident'];

  readonly guidanceByMood: Record<MoodOption, string> = {
    Focused: 'Energy is high. Protect it by finishing your focus mission before switching contexts.',
    Lazy: 'Lower the bar: commit to 5 minutes on the easiest mission and keep going only if momentum appears.',
    Tired: 'Use low-friction tasks first: update expenses, checklist, or one short training prompt.',
    Anxious: 'Shrink the scope. Complete one simple task, then reassess from a calmer state.',
    Confident: 'Use this window for a meaningful step. Take the hardest unfinished mission now.'
  };

  @Input() selectedMood: MoodOption | null = null;
  @Output() selectedMoodChange = new EventEmitter<MoodOption>();

  selectMood(mood: MoodOption): void {
    this.selectedMood = mood;
    this.selectedMoodChange.emit(mood);
  }
}
