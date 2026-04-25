import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

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
            Pick your current mood and let the dashboard give you one simple direction for the next step.
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
        <p class="info-message">Select one mood to get a quick suggestion.</p>
      }
    </section>
  `,
  styles: [`
    .mood-panel {
      padding: 24px;
      border: 1px solid rgba(73, 210, 255, 0.16);
      border-radius: 24px;
      background:
        radial-gradient(circle at top left, rgba(73, 210, 255, 0.1), transparent 32%),
        linear-gradient(180deg, rgba(9, 20, 36, 0.96), rgba(7, 14, 26, 0.98));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 18px 46px rgba(0, 0, 0, 0.22);
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
      border: 1px solid rgba(73, 210, 255, 0.2);
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-main);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
    }

    .mood-option:hover {
      transform: translateY(-1px);
      border-color: rgba(73, 210, 255, 0.45);
      background: rgba(73, 210, 255, 0.08);
    }

    .mood-option--active {
      border-color: rgba(122, 246, 197, 0.3);
      background: linear-gradient(135deg, rgba(73, 210, 255, 0.18), rgba(122, 246, 197, 0.14));
      box-shadow: 0 0 0 1px rgba(122, 246, 197, 0.08);
    }

    .mood-guidance {
      position: relative;
      padding: 18px 20px;
      border: 1px solid rgba(73, 210, 255, 0.12);
      border-radius: 18px;
      background: rgba(10, 23, 40, 0.88);
      box-shadow: 0 0 0 1px rgba(73, 210, 255, 0.02), 0 16px 40px rgba(0, 0, 0, 0.18);
      overflow: hidden;
    }

    .mood-guidance::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(73, 210, 255, 0.36), transparent 82%);
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
    Focused: 'Use your energy now. Complete your highest XP mission.',
    Lazy: 'Do 5 minutes only. Start with the easiest mission.',
    Tired: 'Choose a low-energy mission. Track expenses or do English practice.',
    Anxious: 'Slow down. Complete one simple task and breathe.',
    Confident: 'Take a bold action. Start your hardest mission.'
  };

  selectedMood: MoodOption | null = null;

  selectMood(mood: MoodOption): void {
    this.selectedMood = mood;
  }
}
