import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'app-focus-timer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="focus-timer-panel ui-panel">
      <div class="focus-timer-panel__header">
        <div>
          <p class="focus-timer-panel__eyebrow">Focus</p>
          <h2>Focus Timer</h2>
          <p class="focus-timer-panel__subtitle">
            Use a short countdown to start quickly, stay locked in, and finish one clear block of work.
          </p>
        </div>
      </div>

      <div class="focus-timer-display ui-card ui-accent-line" [class.focus-timer-display--running]="isRunning">
        <span class="focus-timer-display__label">Current Countdown</span>
        <strong>{{ formattedTime }}</strong>
        <p class="focus-timer-display__state">{{ timerStateMessage }}</p>
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
          Start Focus Block
        </button>

        <button type="button" class="reset-day-button" (click)="pauseTimer()" [disabled]="!isRunning">
          Pause Block
        </button>

        <button type="button" class="delete-button" (click)="resetTimer()">
          Reset
        </button>
      </div>

      @if (showCompleteMessage) {
        <p class="success-message focus-timer-success">
          Focus block complete. Capture the result now and mark one mission as done.
        </p>
      }
    </section>
  `,
  styles: [`
    .focus-timer-panel {
      padding: 24px;
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
      overflow: hidden;
      text-align: center;
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
      color: var(--reactor-amber);
      font-size: clamp(2.2rem, 8vw, 3.8rem);
      letter-spacing: 0.08rem;
    }

    .focus-timer-display__state {
      margin: 10px 0 0;
      color: var(--text-muted);
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .focus-timer-display--running {
      box-shadow: 0 0 0 1px rgba(var(--a), 0.1), var(--glow-soft);
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

    .focus-timer-success {
      margin-top: 16px;
      border-color: rgba(var(--s), 0.28);
      background: linear-gradient(90deg, rgba(var(--a), 0.12), rgba(var(--s), 0.14));
      box-shadow: 0 0 24px rgba(var(--s), 0.12);
      animation: focusTimerSuccess 1.4s ease;
    }

    @keyframes focusTimerSuccess {
      0% {
        transform: scale(0.99);
        opacity: 0.7;
      }
      35% {
        transform: scale(1.01);
        opacity: 1;
      }
      100% {
        transform: scale(1);
      }
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

  @Output() timerCompletedChange = new EventEmitter<boolean>();

  secondsRemaining = this.defaultMinutes * 60;
  isRunning = false;
  showCompleteMessage = false;

  get formattedTime(): string {
    const minutes = Math.floor(this.secondsRemaining / 60);
    const seconds = this.secondsRemaining % 60;

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  get timerStateMessage(): string {
    if (this.isRunning) {
      return 'Timer is running. Protect this block and stay on one task.';
    }

    if (this.showCompleteMessage) {
      return 'Great finish. Log progress while the context is still fresh.';
    }

    return 'Choose a mode and start when you are ready for focused work.';
  }

  startTimer(): void {
    if (this.isRunning || this.secondsRemaining <= 0) {
      return;
    }

    this.showCompleteMessage = false;
    this.timerCompletedChange.emit(false);
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      if (this.secondsRemaining > 0) {
        this.secondsRemaining--;
      }

      if (this.secondsRemaining === 0) {
        this.pauseTimer();
        this.showCompleteMessage = true;
        this.timerCompletedChange.emit(true);
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
    this.timerCompletedChange.emit(false);
  }

  setQuickMode(minutes: number): void {
    this.pauseTimer();
    this.secondsRemaining = minutes * 60;
    this.showCompleteMessage = false;
    this.timerCompletedChange.emit(false);
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }
}
