import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-focus-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="focus-timer-panel">
      <div class="focus-timer-panel__header">
        <div>
          <p class="focus-timer-panel__eyebrow">Focus</p>
          <h2>Focus Timer</h2>
          <p class="focus-timer-panel__subtitle">
            Use a short countdown to start quickly, stay locked in, and finish one clear block of work.
          </p>
        </div>
      </div>

      <div class="focus-timer-display">
        <span class="focus-timer-display__label">Current Countdown</span>
        <strong>{{ formattedTime }}</strong>
      </div>

      <div class="focus-timer-modes">
        <button type="button" class="reset-day-button" (click)="setQuickMode(5)">
          5 min quick start
        </button>

        <button type="button" class="reset-day-button" (click)="setQuickMode(25)">
          25 min deep work
        </button>
      </div>

      <div class="focus-timer-actions">
        <button type="button" class="finance-button" (click)="startTimer()" [disabled]="isRunning">
          Start
        </button>

        <button type="button" class="reset-day-button" (click)="pauseTimer()" [disabled]="!isRunning">
          Pause
        </button>

        <button type="button" class="delete-button" (click)="resetTimer()">
          Reset
        </button>
      </div>

      @if (showCompleteMessage) {
        <p class="success-message">
          Focus session complete. Mark one mission done if you completed it.
        </p>
      }
    </section>
  `,
  styles: [`
    .focus-timer-panel {
      padding: 24px;
      border: 1px solid rgba(73, 210, 255, 0.16);
      border-radius: 24px;
      background:
        radial-gradient(circle at top right, rgba(122, 246, 197, 0.08), transparent 28%),
        linear-gradient(180deg, rgba(9, 21, 37, 0.96), rgba(7, 15, 27, 0.98));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03), 0 18px 46px rgba(0, 0, 0, 0.22);
    }

    .focus-timer-panel__header {
      margin-bottom: 20px;
    }

    .focus-timer-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--accent);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .focus-timer-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .focus-timer-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .focus-timer-display {
      position: relative;
      margin-bottom: 18px;
      padding: 22px 20px;
      border: 1px solid rgba(73, 210, 255, 0.12);
      border-radius: 20px;
      background: rgba(10, 23, 40, 0.88);
      box-shadow: 0 0 0 1px rgba(73, 210, 255, 0.02), 0 16px 40px rgba(0, 0, 0, 0.18);
      overflow: hidden;
      text-align: center;
    }

    .focus-timer-display::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, rgba(73, 210, 255, 0.36), transparent 82%);
    }

    .focus-timer-display__label {
      display: block;
      margin-bottom: 10px;
      color: var(--text-muted);
      font-size: 0.8rem;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .focus-timer-display strong {
      color: var(--accent-strong);
      font-size: clamp(2.2rem, 8vw, 3.8rem);
      letter-spacing: 0.08rem;
    }

    .focus-timer-modes,
    .focus-timer-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    .focus-timer-modes {
      margin-bottom: 16px;
    }

    @media (max-width: 640px) {
      .focus-timer-panel {
        padding: 18px;
      }

      .focus-timer-modes,
      .focus-timer-actions {
        display: grid;
        grid-template-columns: 1fr;
      }

      .focus-timer-actions .finance-button,
      .focus-timer-actions .reset-day-button,
      .focus-timer-actions .delete-button,
      .focus-timer-modes .reset-day-button {
        width: 100%;
      }
    }
  `]
})
export class FocusTimerComponent implements OnDestroy {
  private readonly defaultMinutes = 25;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  secondsRemaining = this.defaultMinutes * 60;
  isRunning = false;
  showCompleteMessage = false;

  get formattedTime(): string {
    const minutes = Math.floor(this.secondsRemaining / 60);
    const seconds = this.secondsRemaining % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  startTimer(): void {
    if (this.isRunning || this.secondsRemaining <= 0) {
      return;
    }

    this.showCompleteMessage = false;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;
      }

      if (this.secondsRemaining === 0) {
        this.pauseTimer();
        this.showCompleteMessage = true;
      }
    }, 1000);
  }

  pauseTimer(): void {
    this.isRunning = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resetTimer(): void {
    this.pauseTimer();
    this.secondsRemaining = this.defaultMinutes * 60;
    this.showCompleteMessage = false;
  }

  setQuickMode(minutes: number): void {
    this.pauseTimer();
    this.secondsRemaining = minutes * 60;
    this.showCompleteMessage = false;
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }
}
