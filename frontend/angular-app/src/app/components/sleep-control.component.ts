import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sleep-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="sleep-panel">
      <div class="sleep-panel__header">
        <div>
          <p class="sleep-panel__eyebrow">Recovery Systems</p>
          <h2>Sleep Control</h2>
          <p class="sleep-panel__subtitle">
            Log your sleep window, calculate recovery hours, and compare it against the ideal 7-8 hour target.
          </p>
        </div>

        <article class="sleep-panel__target">
          <span class="sleep-panel__target-label">Ideal Range</span>
          <strong>7-8 Hours</strong>
        </article>
      </div>

      <div class="sleep-form">
        <label class="field">
          <span>Sleep Time</span>
          <input
            type="time"
            name="sleepTime"
            [(ngModel)]="sleepTime"
          />
        </label>

        <label class="field">
          <span>Wake Time</span>
          <input
            type="time"
            name="wakeTime"
            [(ngModel)]="wakeTime"
          />
        </label>

        <div class="sleep-form__actions">
          <button type="button" class="finance-button" (click)="logSleep()">
            Log Sleep
          </button>
        </div>
      </div>

      <div class="sleep-grid">
        <article class="sleep-card sleep-card--primary">
          <span class="sleep-card__label">Sleep Duration</span>
          <strong class="sleep-card__value">{{ formattedSleepDuration }}</strong>
        </article>

        <article class="sleep-card">
          <span class="sleep-card__label">Sleep Quality Status</span>
          <p class="sleep-card__status">{{ sleepQualityStatus }}</p>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .sleep-panel {
      margin-bottom: 24px;
      padding: 24px;
      border: 1px solid var(--metal-border);
      border-radius: 24px;
      background:
        radial-gradient(circle at top right, rgba(var(--h), 0.12), transparent 28%),
        var(--panel-bg-primary);
      box-shadow: var(--shadow-inset-soft), var(--shadow-elev-strong);
    }

    .sleep-panel__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 18px;
      margin-bottom: 20px;
    }

    .sleep-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--arc-cyan);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .sleep-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .sleep-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .sleep-panel__target {
      display: grid;
      gap: 6px;
      min-width: 220px;
      padding: 14px 16px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--color-surface-inset);
    }

    .sleep-panel__target-label {
      color: var(--text-muted);
      font-size: 0.76rem;
      letter-spacing: 0.12rem;
      text-transform: uppercase;
    }

    .sleep-panel__target strong {
      color: var(--reactor-amber);
      font-size: 1rem;
    }

    .sleep-form {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr)) auto;
      gap: 14px;
      margin-bottom: 18px;
    }

    .sleep-form__actions {
      display: flex;
      align-items: flex-end;
    }

    .sleep-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .sleep-card {
      padding: 18px 20px;
      border: 1px solid var(--metal-border);
      border-radius: 18px;
      background: var(--card-bg);
    }

    .sleep-card--primary {
      border-color: rgba(var(--a), 0.3);
      box-shadow: 0 0 0 1px rgba(var(--a), 0.08);
    }

    .sleep-card__label {
      display: block;
      margin-bottom: 10px;
      color: var(--reactor-amber);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .sleep-card__value {
      color: var(--text-main);
      font-size: clamp(1.5rem, 4vw, 2.1rem);
      font-weight: 700;
    }

    .sleep-card__status {
      margin: 0;
      color: var(--text-main);
      line-height: 1.65;
      font-size: 1rem;
    }

    @media (max-width: 820px) {
      .sleep-panel__header {
        flex-direction: column;
      }

      .sleep-panel__target {
        min-width: 0;
        width: 100%;
      }

      .sleep-form,
      .sleep-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .sleep-panel {
        padding: 18px;
      }

      .sleep-form__actions .finance-button {
        width: 100%;
      }
    }
  `]
})
export class SleepControlComponent {
  sleepTime = '23:00';
  wakeTime = '06:30';
  loggedSleepHours = 7.5;

  get formattedSleepDuration(): string {
    const hours = Math.floor(this.loggedSleepHours);
    const minutes = Math.round((this.loggedSleepHours - hours) * 60);

    if (minutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${minutes}m`;
  }

  get sleepQualityStatus(): string {
    if (this.loggedSleepHours < 5) {
      return 'Critical. Fix sleep today.';
    }

    if (this.loggedSleepHours < 6.5) {
      return 'Low energy expected.';
    }

    if (this.loggedSleepHours <= 8) {
      return 'Good recovery.';
    }

    return 'Recovered. Avoid oversleeping.';
  }

  logSleep(): void {
    this.loggedSleepHours = this.calculateSleepHours(this.sleepTime, this.wakeTime);
  }

  private calculateSleepHours(sleepTime: string, wakeTime: string): number {
    const sleepMinutes = this.convertTimeToMinutes(sleepTime);
    const wakeMinutes = this.convertTimeToMinutes(wakeTime);

    if (sleepMinutes === null || wakeMinutes === null) {
      return 0;
    }

    let totalMinutes = wakeMinutes - sleepMinutes;

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }

    return Math.round((totalMinutes / 60) * 10) / 10;
  }

  private convertTimeToMinutes(time: string): number | null {
    const [hoursText, minutesText] = time.split(':');
    const hours = Number(hoursText);
    const minutes = Number(minutesText);

    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }

    return (hours * 60) + minutes;
  }
}
