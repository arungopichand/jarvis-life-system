import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface ProtocolSection {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-daily-life-protocol',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="life-protocol-panel">
      <div class="life-protocol-panel__header">
        <div>
          <p class="life-protocol-panel__eyebrow">Integrated Guidance</p>
          <h2>Daily Life Protocol</h2>
          <p class="life-protocol-panel__subtitle">
            One central daily protocol for body, mind, wealth, growth, and character.
          </p>
        </div>

        <article class="life-protocol-status">
          <span class="life-protocol-status__label">System Priority</span>
          <strong>Execute Balanced Growth</strong>
          <span>{{ focusMissionTitle }}</span>
        </article>
      </div>

      <div class="life-protocol-grid">
        @for (section of protocolSections; track section.title) {
          <article class="life-protocol-card">
            <span class="life-protocol-card__label">{{ section.title }}</span>

            <ul class="life-protocol-list">
              @for (item of section.items; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .life-protocol-panel {
      margin-bottom: 24px;
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 26px;
      background:
        radial-gradient(circle at top right, rgba(var(--a), 0.1), transparent 28%),
        radial-gradient(circle at left, rgba(var(--h), 0.12), transparent 26%),
        var(--panel-bg-primary);
      box-shadow: var(--shadow-inset-soft), var(--shadow-elev-deep);
    }

    .life-protocol-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 20px;
    }

    .life-protocol-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--arc-cyan);
      font-size: 0.8rem;
      letter-spacing: 0.22rem;
      text-transform: uppercase;
    }

    .life-protocol-panel__header h2 {
      margin: 0;
      font-size: clamp(1.5rem, 3vw, 2rem);
    }

    .life-protocol-panel__subtitle {
      margin: 10px 0 0;
      max-width: 680px;
      color: var(--text-muted);
      line-height: 1.65;
    }

    .life-protocol-status {
      display: grid;
      gap: 6px;
      min-width: 250px;
      padding: 16px 18px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--color-surface-inset);
    }

    .life-protocol-status__label {
      color: var(--text-muted);
      font-size: 0.76rem;
      letter-spacing: 0.12rem;
      text-transform: uppercase;
    }

    .life-protocol-status strong {
      color: var(--reactor-amber);
      font-size: 1rem;
    }

    .life-protocol-status span:last-child {
      color: var(--text-main);
      line-height: 1.5;
    }

    .life-protocol-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .life-protocol-card {
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 20px;
      background: var(--card-bg);
      box-shadow: var(--shadow-inset-subtle);
    }

    .life-protocol-card__label {
      display: block;
      margin-bottom: 14px;
      color: var(--reactor-amber);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1rem;
      text-transform: uppercase;
    }

    .life-protocol-list {
      display: grid;
      gap: 10px;
      margin: 0;
      padding-left: 18px;
      color: var(--text-main);
    }

    .life-protocol-list li {
      line-height: 1.65;
    }

    .life-protocol-list li::marker {
      color: var(--arc-cyan);
    }

    @media (max-width: 820px) {
      .life-protocol-panel__header {
        flex-direction: column;
      }

      .life-protocol-status {
        min-width: 0;
        width: 100%;
      }

      .life-protocol-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .life-protocol-panel {
        padding: 18px;
      }
    }
  `]
})
export class DailyLifeProtocolComponent {
  @Input() dailySpendingLimit = 0;
  @Input() mainSkill = '';
  @Input() gymMinutesTarget = 45;
  @Input() proteinGramsTarget = 80;
  @Input() currentEnglishPrompt = '';
  @Input() currentConfidencePrompt = '';
  @Input() focusMissionTitle = '';
  @Input() currentStreak = 0;

  get protocolSections(): ProtocolSection[] {
    const mainSkill = this.mainSkill.trim() || 'your main skill';
    const englishOrConfidence = this.currentConfidencePrompt.trim()
      || this.currentEnglishPrompt.trim()
      || 'Do one short English or confidence practice block.';

    return [
      {
        title: 'Body Protocol',
        items: [
          'Water reminder: 3 liters today.',
          'Sleep target: 7.5 hours tonight.',
          `Gym target: ${this.gymMinutesTarget} minutes.`,
          `Protein target: ${this.proteinGramsTarget} grams.`,
          'Skin care routine: cleanse + moisturize.'
        ]
      },
      {
        title: 'Mind Protocol',
        items: [
          'Dopamine control: no scrolling before first mission.',
          'Focus block: 25 minutes of deep work.',
          'Emotional stability task: 2 minutes of slow breathing before reacting.'
        ]
      },
      {
        title: 'Wealth Protocol',
        items: [
          'Track expenses before the day ends.',
          `Stay under spending limit: ${this.dailySpendingLimit}.`,
          `Learn one wealth-building concept: ${this.wealthConceptOfTheDay}.`
        ]
      },
      {
        title: 'Growth Protocol',
        items: [
          `Main skill practice: ${mainSkill}.`,
          `English/confidence practice: ${englishOrConfidence}`,
          `One daily tip/trick: ${this.dailyTip}`
        ]
      },
      {
        title: 'Character Protocol',
        items: [
          `Discipline action: ${this.focusMissionTitle || 'Execute the next mission immediately.'}`,
          'Moral strength reminder: choose what is right over what is easy.',
          this.currentStreak > 0
            ? `Consistency reminder: protect your ${this.currentStreak}-day streak with one clean win today.`
            : 'Consistency reminder: one honest rep today is how the streak begins.'
        ]
      }
    ];
  }

  get wealthConceptOfTheDay(): string {
    const concepts = [
      'compound interest',
      'cash flow',
      'emergency fund discipline',
      'opportunity cost',
      'asset vs liability thinking',
      'long-term investing basics',
      'budgeting with intent'
    ];

    return concepts[this.getDayIndex(concepts.length)];
  }

  get dailyTip(): string {
    const tips = [
      'Write tomorrow\'s first task before ending the day.',
      'Reduce friction by preparing tools before deep work starts.',
      'Use a timer when a task feels too big to begin.',
      'Keep one short note of what worked today.',
      'Finish one hard thing before opening entertainment.',
      'Batch small decisions to protect focus.',
      'Review progress at night, not just intentions in the morning.'
    ];

    return tips[this.getDayIndex(tips.length)];
  }

  private getDayIndex(size: number): number {
    return new Date().getDay() % size;
  }
}
