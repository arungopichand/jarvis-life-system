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
          <span>Message</span>
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
  `
})
export class JarvisAssistantComponent {
  @Input({ required: true }) chatHistory!: ChatMessage[];
  @Input({ required: true }) assistantMessage!: string;

  @Output() assistantMessageChange = new EventEmitter<string>();
  @Output() send = new EventEmitter<void>();
}
