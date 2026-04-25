import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-training-room',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="training-panel">
      <div class="training-panel__header">
        <div>
          <p class="training-panel__eyebrow">Skills</p>
          <h2>Training Room</h2>
          <p class="hero__subtitle training-panel__subtitle">
            Gym target: {{ gymMinutesTarget }} minutes. Protein target: {{ proteinGramsTarget }}g.
          </p>
        </div>
      </div>

      <div class="training-grid">
        <article class="training-card">
          <div class="training-card__content">
            <h3>English Practice</h3>
            <p>{{ currentEnglishPrompt }}</p>
          </div>

          <button type="button" class="training-button" (click)="nextEnglishPrompt.emit()">
            New Prompt
          </button>
        </article>

        <article class="training-card">
          <div class="training-card__content">
            <h3>Confidence Challenge</h3>
            <p>{{ currentConfidencePrompt }}</p>
          </div>

          <button type="button" class="training-button" (click)="nextConfidencePrompt.emit()">
            New Prompt
          </button>
        </article>

        <article class="training-card">
          <div class="training-card__content">
            <h3>Typing Practice</h3>
            <p>{{ currentTypingPrompt }}</p>
          </div>

          <button type="button" class="training-button" (click)="nextTypingPrompt.emit()">
            New Prompt
          </button>
        </article>
      </div>
    </section>
  `
})
export class TrainingRoomComponent {
  @Input() currentEnglishPrompt = '';
  @Input() currentConfidencePrompt = '';
  @Input() currentTypingPrompt = '';
  @Input() gymMinutesTarget = 0;
  @Input() proteinGramsTarget = 0;

  @Output() nextEnglishPrompt = new EventEmitter<void>();
  @Output() nextConfidencePrompt = new EventEmitter<void>();
  @Output() nextTypingPrompt = new EventEmitter<void>();
}
