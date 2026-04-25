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

      <div class="assistant-history">
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
      </div>

      <form class="assistant-form" (ngSubmit)="send.emit()">
        <label class="field">
          <span>Quick Message</span>
          <input
            type="text"
            name="assistantMessage"
            [ngModel]="assistantMessage"
            (ngModelChange)="assistantMessageChange.emit($event)"
            placeholder="Ask JARVIS what to do next..."
          />
        </label>

        <button type="submit" class="finance-button">Send</button>
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

    .chat-message {
      max-width: min(100%, 720px);
    }

    .chat-message--assistant {
      background: linear-gradient(180deg, rgba(11, 28, 47, 0.94), rgba(9, 21, 37, 0.94));
    }

    .chat-message--user {
      border-color: rgba(122, 246, 197, 0.16);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
    }

    .assistant-form .field {
      margin: 0;
    }
  `]
})
export class JarvisAssistantComponent {
  @Input({ required: true }) chatHistory!: ChatMessage[];
  @Input({ required: true }) assistantMessage!: string;

  @Output() assistantMessageChange = new EventEmitter<string>();
  @Output() send = new EventEmitter<void>();
}
