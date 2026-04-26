import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ChatMessage } from '../models/chat-message';

@Component({
  selector: 'app-jarvis-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="training-panel assistant-panel">
      <div class="training-panel__header">
        <div>
          <p class="training-panel__eyebrow">Support</p>
          <h2>JARVIS Assistant</h2>
          <p class="assistant-panel__subtitle">
            Ask for the next step, a study push, or a quick decision prompt when momentum drops.
          </p>
        </div>
      </div>

      <div class="assistant-companion-bar">
        <span class="assistant-companion-bar__label">Companion Mode</span>
        <p>{{ recentActivitySummary }}</p>
      </div>

      @if (nextRecommendedAction) {
        <div class="assistant-next-action ui-card ui-accent-line">
          <span class="assistant-next-action__label">Next action</span>
          <p>{{ nextRecommendedAction }}</p>
        </div>
      }

      <div class="assistant-history" [class.assistant-history--empty]="chatHistory.length === 0">
        @if (chatHistory.length === 0) {
          <div class="assistant-empty-state" aria-live="polite">
            <p class="assistant-empty-state__title">No conversation yet.</p>
            <p class="assistant-empty-state__hint">Start with a quick check-in and I will guide your next move.</p>
          </div>
        } @else {
          @for (message of chatHistory; track $index) {
            <article
              class="chat-message"
              [class.chat-message--user]="message.sender === 'user'"
              [class.chat-message--assistant]="message.sender === 'assistant'"
            >
              <span class="chat-message__label">
                {{ message.sender === 'user' ? 'You' : 'JARVIS' }}
              </span>
              <p>{{ message.text }}</p>
            </article>
          }
        }
      </div>

      <div class="assistant-quick-actions">
        <button type="button" class="assistant-quick-action ui-chip" (click)="askQuickPrompt('What is my next best action right now?')">
          Next best action
        </button>
        <button type="button" class="assistant-quick-action ui-chip" (click)="askQuickPrompt('Give me a 5-minute restart plan')">
          5-minute restart
        </button>
        <button type="button" class="assistant-quick-action ui-chip" (click)="askQuickPrompt('How should I protect momentum for the rest of today?')">
          Protect momentum
        </button>
      </div>

      <form class="assistant-form" (ngSubmit)="send.emit()">
        <label class="field">
          <span>Message</span>
          <input
            type="text"
            name="assistantMessage"
            [ngModel]="assistantMessage"
            (ngModelChange)="assistantMessageChange.emit($event)"
            placeholder="Ask JARVIS for your next best action..."
          />
        </label>

        <button type="submit" class="finance-button" [disabled]="!assistantMessage.trim()">Send</button>
      </form>
    </section>
  `,
  styles: [`
    .assistant-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 620px;
      line-height: 1.6;
    }

    .assistant-history {
      max-height: 380px;
    }

    .assistant-next-action {
      margin-bottom: 14px;
      padding: 12px 14px;
      box-shadow: none;
    }

    .assistant-next-action__label {
      display: block;
      margin-bottom: 6px;
      color: var(--text-muted);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .assistant-next-action p {
      margin: 0;
      color: var(--text-main);
      line-height: 1.55;
    }

    .assistant-companion-bar {
      display: grid;
      gap: 6px;
      margin-bottom: 14px;
      padding: 12px 14px;
      border: 1px solid var(--color-border-soft);
      border-radius: 14px;
      background: var(--card-bg-muted);
    }

    .assistant-companion-bar__label {
      color: var(--accent);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .assistant-companion-bar p {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.5;
    }

    .assistant-history--empty {
      align-content: center;
      min-height: 180px;
    }

    .assistant-empty-state {
      padding: 18px;
      border: 1px dashed var(--color-border-soft);
      border-radius: 16px;
      background: var(--state-hover);
    }

    .assistant-empty-state__title {
      margin: 0 0 6px;
      font-weight: 600;
      color: var(--text-main);
    }

    .assistant-empty-state__hint {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.55;
    }

    .assistant-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 14px;
    }

    .assistant-quick-action {
      cursor: pointer;
      transition: var(--transition-interactive);
    }

    .assistant-quick-action:hover {
      transform: translateY(-1px);
      border-color: rgba(var(--a), 0.38);
      background: rgba(var(--a), 0.1);
    }

    .chat-message {
      max-width: min(100%, 720px);
    }

    .chat-message--assistant {
      background: linear-gradient(180deg, var(--elev-2), rgba(var(--i), 0.08));
    }

    .chat-message--user {
      border-color: rgba(var(--s), 0.16);
      box-shadow: var(--shadow-inset-soft);
    }

    .assistant-form .field {
      margin: 0;
    }
  `]
})
export class JarvisAssistantComponent {
  @Input({ required: true }) chatHistory!: ChatMessage[];
  @Input({ required: true }) assistantMessage!: string;
  @Input() recentActivitySummary = 'I read your dashboard context and suggest the smallest high-impact next action.';
  @Input() nextRecommendedAction = '';

  @Output() assistantMessageChange = new EventEmitter<string>();
  @Output() send = new EventEmitter<void>();

  askQuickPrompt(prompt: string): void {
    this.assistantMessageChange.emit(prompt);
    this.send.emit();
  }
}
