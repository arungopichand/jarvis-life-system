import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-identity-upgrade',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="identity-panel">
      <div class="identity-panel__header">
        <div>
          <p class="identity-panel__eyebrow">Mindset</p>
          <h2>Identity Upgrade</h2>
          <p class="identity-panel__subtitle">
            A small reminder of who you are becoming, plus a quick boost when you need another push.
          </p>
        </div>

        <button type="button" class="finance-button" (click)="boostMe()">
          Boost Me
        </button>
      </div>

      <article class="identity-card">
        <span class="identity-card__label">Current Identity Signal</span>
        <p>{{ identityMessage }}</p>
      </article>

      <article class="identity-card identity-card--boost">
        <span class="identity-card__label">Boost Message</span>
        <p>{{ boostMessage }}</p>
      </article>
    </section>
  `,
  styles: [`
    .identity-panel {
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 24px;
      background:
        radial-gradient(circle at top right, rgba(var(--a), 0.1), transparent 28%),
        var(--panel-bg-primary);
      box-shadow: var(--shadow-inset-subtle), var(--shadow-elev-strong);
    }

    .identity-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 18px;
    }

    .identity-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--accent);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .identity-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .identity-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .identity-card {
      position: relative;
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--card-bg);
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    .identity-card::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: var(--line-accent-mid);
    }

    .identity-card + .identity-card {
      margin-top: 14px;
    }

    .identity-card--boost {
      border-color: rgba(var(--h), 0.24);
      background: var(--panel-bg-warning);
    }

    .identity-card__label {
      display: block;
      margin-bottom: 10px;
      color: var(--accent);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .identity-card p {
      margin: 0;
      color: var(--text-main);
      line-height: 1.7;
      font-size: 1rem;
    }

    @media (max-width: 820px) {
      .identity-panel__header {
        flex-direction: column;
        align-items: stretch;
      }

      .identity-panel__header .finance-button {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .identity-panel {
        padding: 18px;
      }
    }
  `]
})
export class IdentityUpgradeComponent {
  private readonly boostMessages = [
    'Action creates confidence.',
    'Five minutes beats zero.',
    'Discipline is built one rep at a time.',
    'You do not need to feel ready. Start.',
    'Small wins compound.'
  ];

  private boostIndex = 0;

  @Input() dailyScore = 0;
  @Input() currentStreak = 0;
  @Input() completedMissionsToday = 0;

  boostMessage = this.boostMessages[0];

  get identityMessage(): string {
    if (this.dailyScore >= 90) {
      return 'You are operating with elite discipline.';
    }

    if (this.dailyScore >= 70) {
      return 'You are becoming consistent.';
    }

    if (this.currentStreak >= 3) {
      return 'You are building momentum.';
    }

    if (this.completedMissionsToday >= 1) {
      return 'You kept your promise today.';
    }

    return 'Start small. One action changes the day.';
  }

  boostMe(): void {
    this.boostIndex = (this.boostIndex + 1) % this.boostMessages.length;
    this.boostMessage = this.boostMessages[this.boostIndex];
  }
}
