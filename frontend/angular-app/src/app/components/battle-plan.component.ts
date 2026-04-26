import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { Mission } from '../models/mission';

interface BattlePlan {
  firstAction: string;
  skillFocus: string;
  moneyStatus: string;
  healthReminder: string;
  confidenceTask: string;
}

@Component({
  selector: 'app-battle-plan',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="battle-plan-panel ui-panel">
      <div class="battle-plan-panel__header">
        <div>
          <p class="battle-plan-panel__eyebrow">Planner</p>
          <h2>Today's Battle Plan</h2>
          <p class="battle-plan-panel__subtitle">
            Build a simple plan from your current missions, streak, spending, and focus settings.
          </p>
        </div>

      </div>

      @if (plan) {
        <div class="battle-plan-grid">
          <article class="battle-plan-card ui-card ui-accent-line battle-plan-card--primary">
            <span class="battle-plan-card__label">First Action</span>
            <p>{{ plan.firstAction }}</p>
          </article>

          <article class="battle-plan-card ui-card ui-accent-line">
            <span class="battle-plan-card__label">Skill Focus</span>
            <p>{{ plan.skillFocus }}</p>
          </article>

          <article class="battle-plan-card ui-card ui-accent-line">
            <span class="battle-plan-card__label">Money Status</span>
            <p>{{ plan.moneyStatus }}</p>
          </article>

          <article class="battle-plan-card ui-card ui-accent-line">
            <span class="battle-plan-card__label">Health Reminder</span>
            <p>{{ plan.healthReminder }}</p>
          </article>

          <article class="battle-plan-card ui-card ui-accent-line battle-plan-card--wide">
            <span class="battle-plan-card__label">Confidence / English Mini-Task</span>
            <p>{{ plan.confidenceTask }}</p>
          </article>
        </div>
      }
    </section>
  `,
  styles: [`
    .battle-plan-panel {
      padding: 24px;
    }

    .battle-plan-panel__header { margin-bottom: 20px; }

    .battle-plan-panel__eyebrow {
      margin: 0 0 8px;
      color: var(--text-muted);
      font-size: 0.78rem;
      letter-spacing: 0.18rem;
      text-transform: uppercase;
    }

    .battle-plan-panel__header h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .battle-plan-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .battle-plan-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .battle-plan-card {
      position: relative;
      padding: 18px 20px;
      overflow: hidden;
    }

    .battle-plan-card--primary {
      border-color: rgba(var(--h), 0.26);
      background: linear-gradient(180deg, rgba(var(--h), 0.12), var(--card-bg));
    }

    .battle-plan-card--wide {
      grid-column: 1 / -1;
    }

    .battle-plan-card__label {
      display: block;
      margin-bottom: 10px;
      color: var(--text-muted);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .battle-plan-card--primary .battle-plan-card__label {
      color: var(--warning);
    }

    .battle-plan-card p {
      margin: 0;
      color: var(--text-main);
      line-height: 1.7;
    }

    @media (max-width: 820px) {
      .battle-plan-grid {
        grid-template-columns: 1fr;
      }

      .battle-plan-card--wide {
        grid-column: auto;
      }
    }

    @media (max-width: 640px) {
      .battle-plan-panel {
        padding: 18px;
      }
    }
  `]
})
export class BattlePlanComponent implements OnChanges {
  @Input({ required: true }) missions!: Mission[];
  @Input() focusMissionId: number | null = null;
  @Input() mainSkill = '';
  @Input() dailySpendingLimit = 0;
  @Input() totalSpentToday = 0;
  @Input() currentStreak = 0;
  @Input() averageCompletionPercentageThisWeek = 0;
  @Input() gymMinutesTarget = 0;
  @Input() currentConfidencePrompt = '';
  @Input() currentEnglishPrompt = '';

  plan: BattlePlan | null = null;

  ngOnChanges(_: SimpleChanges): void {
    const incompleteMissions = this.missions.filter((mission) => !mission.isCompleted);
    const focusMission = incompleteMissions.find((mission) => mission.id === this.focusMissionId);
    const firstMission = focusMission ?? incompleteMissions[0] ?? null;
    const remainingMoney = this.dailySpendingLimit - this.totalSpentToday;
    const preferredSkill = this.mainSkill.trim() || 'your main skill';

    this.plan = {
      firstAction: this.getFirstAction(firstMission),
      skillFocus: this.getSkillFocus(preferredSkill),
      moneyStatus: this.getMoneyStatus(remainingMoney),
      healthReminder: this.getHealthReminder(),
      confidenceTask: this.getConfidenceTask()
    };
  }

  private getFirstAction(firstMission: Mission | null): string {
    if (firstMission) {
      return `Complete ${firstMission.title} for ${firstMission.xpReward} XP.`;
    }

    return 'Your missions are clear. Review your wins and prepare tomorrow\'s first move.';
  }

  private getSkillFocus(preferredSkill: string): string {
    if (this.currentStreak >= 5 || this.averageCompletionPercentageThisWeek >= 70) {
      return `Study ${preferredSkill} for 25 minutes while your momentum is strong.`;
    }

    return `Study ${preferredSkill} for 15 focused minutes to rebuild momentum.`;
  }

  private getMoneyStatus(remainingMoney: number): string {
    if (remainingMoney < 0) {
      return `You are ${Math.abs(remainingMoney).toFixed(0)} over today's spending limit. Pause extra spending.`;
    }

    if (remainingMoney === 0) {
      return 'You have reached today\'s spending limit. Keep the rest of the day spend-free.';
    }

    return `You have ${remainingMoney.toFixed(0)} left from today's spending limit.`;
  }

  private getHealthReminder(): string {
    if (this.gymMinutesTarget > 0) {
      return `Hit your gym target: ${this.gymMinutesTarget} minutes.`;
    }

    return 'Take a short walk, hydrate, and reset your posture before the next task.';
  }

  private getConfidenceTask(): string {
    const confidencePrompt = this.currentConfidencePrompt.trim();
    const englishPrompt = this.currentEnglishPrompt.trim();

    if (this.averageCompletionPercentageThisWeek < 50 && confidencePrompt) {
      return confidencePrompt;
    }

    if (englishPrompt) {
      return englishPrompt;
    }

    if (confidencePrompt) {
      return confidencePrompt;
    }

    return 'Say hi to one person today.';
  }
}
