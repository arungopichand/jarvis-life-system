import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { DailyGuide } from '../models/daily-guide';
import { DailyProgressToday } from '../models/daily-progress';

@Component({
  selector: 'app-today-command-center',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="guide-panel today-command-panel">
      <div class="guide-panel__header">
        <div>
          <p class="guide-panel__eyebrow">Today Command Center</p>
          <h2>Daily Guidance</h2>
          <p class="guide-panel__message">
            One calm operating view for learning, communication, health, wealth, and execution.
          </p>
        </div>
      </div>

      @if (!guide) {
        <p class="info-message">Loading today's guide...</p>
      } @else {
        <section class="today-progress ui-card ui-accent-line">
          <div class="today-progress__header">
            <div>
              <p class="today-progress__eyebrow">Today's Progress Snapshot</p>
              <p class="today-progress__score">{{ dailyProgress?.dayCompletionScore ?? 0 }}%</p>
            </div>
            <span class="ui-chip" [class.ui-chip--success]="(dailyProgress?.dayCompletionScore ?? 0) >= 80">
              {{ completionTone }}
            </span>
          </div>
          <p class="today-progress__next">
            Next action: {{ dailyProgress?.nextRecommendedAction ?? 'Load your progress to get the next best step.' }}
          </p>

          <div class="today-completion-grid">
            @for (item of completionItems; track item.label) {
              <article class="today-completion-item">
                <span>{{ item.label }}</span>
                <span
                  class="ui-chip"
                  [class.ui-chip--success]="item.completed"
                  [class.ui-chip--info]="!item.completed"
                >
                  {{ item.completed ? 'Done' : 'Pending' }}
                </span>
              </article>
            }
          </div>
        </section>

        <div class="today-grid">
          <article class="today-card ui-card ui-accent-line">
            <div class="today-card__head">
              <span class="today-card__label">1. Today's Mission</span>
              <span class="ui-chip" [class.ui-chip--success]="missionCompletedToday" [class.ui-chip--info]="!missionCompletedToday">
                {{ missionCompletedToday ? 'Completed' : 'Open' }}
              </span>
            </div>
            <p>{{ guide.todaysMission }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <div class="today-card__head">
              <span class="today-card__label">2. Learn Today</span>
              <span class="ui-chip" [class.ui-chip--success]="learningCompletedToday" [class.ui-chip--info]="!learningCompletedToday">
                {{ learningCompletedToday ? 'Completed' : 'Open' }}
              </span>
            </div>
            <p>{{ guide.learningTopic }}</p>
            <p class="today-card__subtle">{{ guide.mentalModel }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <div class="today-card__head">
              <span class="today-card__label">3. English Word</span>
              <span class="ui-chip" [class.ui-chip--success]="communicationCompletedToday" [class.ui-chip--info]="!communicationCompletedToday">
                {{ communicationCompletedToday ? 'Completed' : 'Open' }}
              </span>
            </div>
            <p><strong>{{ guide.englishWord }}:</strong> {{ guide.englishMeaning }}</p>
            <p class="today-card__subtle">{{ guide.englishExampleSentence }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <span class="today-card__label">4. Confidence Drill</span>
            <p>{{ guide.confidenceDrill }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <div class="today-card__head">
              <span class="today-card__label">5. Wealth Focus</span>
              <span class="ui-chip" [class.ui-chip--success]="incomeCompletedToday" [class.ui-chip--info]="!incomeCompletedToday">
                {{ incomeCompletedToday ? 'Completed' : 'Open' }}
              </span>
            </div>
            <p>{{ guide.wealthFocus }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <span class="today-card__label">6. Health / Diet / Physical</span>
            <p>{{ guide.healthTip }}</p>
            <p>{{ guide.dietTip }}</p>
            <p class="today-card__subtle">{{ guide.physicalChallenge }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <span class="today-card__label">7. Quote / Story</span>
            <p>{{ guide.quoteOfTheDay }}</p>
            <p class="today-card__subtle">{{ guide.inspirationStory }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <div class="today-card__head">
              <span class="today-card__label">8. Diary Prompt</span>
              <span class="ui-chip" [class.ui-chip--success]="diaryCompletedToday" [class.ui-chip--info]="!diaryCompletedToday">
                {{ diaryCompletedToday ? 'Completed' : 'Open' }}
              </span>
            </div>
            <p>{{ guide.reflectionPrompt }}</p>
          </article>

          <article class="today-card ui-card ui-accent-line">
            <span class="today-card__label">9. Blog Prompt</span>
            <p>{{ guide.blogPrompt }}</p>
            <p class="today-card__subtle">{{ guide.focusMissionSuggestion }}</p>
          </article>
        </div>
      }
    </section>
  `,
  styles: [`
    .today-progress {
      margin-bottom: 14px;
      padding: 16px;
    }

    .today-progress__header {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
      margin-bottom: 10px;
    }

    .today-progress__eyebrow {
      margin: 0 0 6px;
      color: var(--text-muted);
      font-size: 0.78rem;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .today-progress__score {
      margin: 0;
      color: var(--text-main);
      font-size: clamp(1.2rem, 3vw, 1.7rem);
      font-weight: 700;
    }

    .today-progress__next {
      margin: 0 0 10px;
      color: var(--text-muted);
      line-height: 1.55;
    }

    .today-completion-grid {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 8px;
    }

    .today-completion-item {
      display: grid;
      gap: 6px;
      padding: 10px;
      border: 1px solid var(--color-border-soft);
      border-radius: 12px;
      background: var(--state-hover);
      color: var(--text-main);
      font-size: 0.86rem;
      line-height: 1.4;
    }

    .today-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .today-card {
      padding: 14px 16px;
      box-shadow: none;
    }

    .today-card__head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 8px;
    }

    .today-card__label {
      display: block;
      color: var(--text-muted);
      font-size: 0.78rem;
      letter-spacing: 0.06rem;
      text-transform: uppercase;
    }

    .today-card p {
      margin: 0 0 8px;
      line-height: 1.55;
      color: var(--text-main);
    }

    .today-card p:last-child {
      margin-bottom: 0;
    }

    .today-card__subtle {
      color: var(--text-muted) !important;
      font-size: 0.9rem;
    }

    @media (max-width: 920px) {
      .today-completion-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .today-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 700px) {
      .today-completion-grid {
        grid-template-columns: 1fr;
      }

      .today-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TodayCommandCenterComponent {
  @Input() guide: DailyGuide | null = null;
  @Input() dailyProgress: DailyProgressToday | null = null;

  get missionCompletedToday(): boolean {
    return (this.dailyProgress?.completedMissionsCount ?? 0) > 0;
  }

  get learningCompletedToday(): boolean {
    return this.dailyProgress?.learningLoggedToday ?? false;
  }

  get communicationCompletedToday(): boolean {
    return this.dailyProgress?.communicationLoggedToday ?? false;
  }

  get diaryCompletedToday(): boolean {
    return this.dailyProgress?.diaryWrittenToday ?? false;
  }

  get incomeCompletedToday(): boolean {
    return this.dailyProgress?.incomeLoggedToday ?? false;
  }

  get completionTone(): string {
    const score = this.dailyProgress?.dayCompletionScore ?? 0;

    if (score >= 80) {
      return 'Calm momentum';
    }

    if (score >= 50) {
      return 'In motion';
    }

    return 'Early steps';
  }

  get completionItems(): Array<{ label: string; completed: boolean }> {
    return [
      { label: 'Learning', completed: this.learningCompletedToday },
      { label: 'Communication', completed: this.communicationCompletedToday },
      { label: 'Mission', completed: this.missionCompletedToday },
      { label: 'Diary', completed: this.diaryCompletedToday },
      { label: 'Wealth', completed: this.incomeCompletedToday }
    ];
  }
}
