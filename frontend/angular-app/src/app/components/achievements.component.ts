import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface AchievementBadge {
  title: string;
  unlocked: boolean;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="achievements-panel">
      <div class="achievements-panel__header">
        <div>
          <p class="achievements-panel__eyebrow">Progress</p>
          <h2>Achievements</h2>
          <p class="achievements-panel__subtitle">
            Frontend-only badges that light up as you complete key habits and milestones today.
          </p>
        </div>
      </div>

      <div class="achievements-grid">
        @for (badge of badges; track badge.title) {
          <article
            class="achievement-badge"
            [class.achievement-badge--unlocked]="badge.unlocked"
            [class.achievement-badge--locked]="!badge.unlocked"
          >
            <span class="achievement-badge__status">
              {{ badge.unlocked ? 'Unlocked' : 'Locked' }}
            </span>
            <h3>{{ badge.title }}</h3>
          </article>
        }
      </div>
    </section>
  `,
  styles: [`
    .achievements-panel {
      padding: 24px;
      border: 1px solid rgba(73, 210, 255, 0.16);
      border-radius: 24px;
      background:
        radial-gradient(circle at top left, rgba(122, 246, 197, 0.08), transparent 30%),
        linear-gradient(180deg, rgba(9, 20, 36, 0.96), rgba(7, 14, 26, 0.98));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 18px 46px rgba(0, 0, 0, 0.22);
    }

    .achievements-panel__header {
      margin-bottom: 20px;
    }

    .achievements-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--accent);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .achievements-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .achievements-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }

    .achievement-badge {
      position: relative;
      padding: 18px 16px;
      border-radius: 18px;
      overflow: hidden;
      min-height: 124px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 14px;
    }

    .achievement-badge::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(73, 210, 255, 0.34), transparent 82%);
    }

    .achievement-badge--locked {
      border: 1px solid rgba(73, 210, 255, 0.1);
      background: rgba(10, 23, 40, 0.62);
      opacity: 0.72;
    }

    .achievement-badge--unlocked {
      border: 1px solid rgba(122, 246, 197, 0.22);
      background: linear-gradient(180deg, rgba(11, 31, 34, 0.96), rgba(8, 20, 24, 0.98));
      box-shadow: 0 0 0 1px rgba(122, 246, 197, 0.04), 0 16px 40px rgba(0, 0, 0, 0.18);
    }

    .achievement-badge__status {
      color: var(--accent);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .achievement-badge h3 {
      margin: 0;
      color: var(--text-main);
      font-size: 1rem;
      line-height: 1.5;
    }

    @media (max-width: 1000px) {
      .achievements-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 640px) {
      .achievements-panel {
        padding: 18px;
      }

      .achievements-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AchievementsComponent {
  @Input() completedMissionsToday = 0;
  @Input() totalSpentToday = 0;
  @Input() dailySpendingLimit = 0;
  @Input() isFocusSessionComplete = false;
  @Input() morningCompleted = false;
  @Input() nightCompleted = false;
  @Input() currentStreak = 0;

  get badges(): AchievementBadge[] {
    return [
      {
        title: 'First Mission Complete',
        unlocked: this.completedMissionsToday >= 1
      },
      {
        title: '3 Missions in a Day',
        unlocked: this.completedMissionsToday >= 3
      },
      {
        title: 'Under Spending Limit',
        unlocked: this.totalSpentToday <= this.dailySpendingLimit
      },
      {
        title: 'Focus Session Complete',
        unlocked: this.isFocusSessionComplete
      },
      {
        title: 'Morning Checklist Complete',
        unlocked: this.morningCompleted
      },
      {
        title: 'Night Checklist Complete',
        unlocked: this.nightCompleted
      },
      {
        title: '3 Day Streak',
        unlocked: this.currentStreak >= 3
      },
      {
        title: '7 Day Streak',
        unlocked: this.currentStreak >= 7
      }
    ];
  }
}
