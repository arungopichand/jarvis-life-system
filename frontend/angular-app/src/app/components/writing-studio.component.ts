import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BlogDraft, BlogDraftStatus } from '../models/blog-draft';
import { DiaryEntry } from '../models/diary-entry';

@Component({
  selector: 'app-writing-studio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="training-panel writing-panel">
      <div class="training-panel__header">
        <div>
          <p class="training-panel__eyebrow">Writing</p>
          <h2>Diary + Blog Studio</h2>
          <p class="writing-panel__subtitle">
            Reflect privately, then convert insights into publish-ready communication practice.
          </p>
        </div>
      </div>

      <div class="writing-prompts">
        <article class="ui-card">
          <span class="writing-label">Today's Reflection Prompt</span>
          <p>{{ reflectionPrompt }}</p>
        </article>
        <article class="ui-card">
          <span class="writing-label">Daily Blog Prompt</span>
          <p>{{ blogPrompt }}</p>
        </article>
      </div>

      <form class="writing-form" (ngSubmit)="addDiary.emit()">
        <h3>Private Diary Entry</h3>
        <label class="field">
          <span>Mood</span>
          <input
            type="text"
            name="mood"
            [ngModel]="diaryForm.mood"
            (ngModelChange)="updateDiaryField('mood', $event)"
            placeholder="Focused, grateful, tired..."
          />
        </label>
        <label class="field writing-form__wide">
          <span>Entry</span>
          <textarea
            name="content"
            rows="4"
            [ngModel]="diaryForm.content"
            (ngModelChange)="updateDiaryField('content', $event)"
            placeholder="Write honestly about today's progress and mindset."
          ></textarea>
        </label>
        <button type="submit" class="finance-button" [disabled]="!isDiaryValid">Save Diary</button>
      </form>

      <form class="writing-form" (ngSubmit)="addDraft.emit()">
        <h3>Blog Draft</h3>
        <label class="field">
          <span>Title</span>
          <input
            type="text"
            name="title"
            [ngModel]="draftForm.title"
            (ngModelChange)="updateDraftField('title', $event)"
            placeholder="What I learned from one focused sprint"
          />
        </label>
        <label class="field">
          <span>Topic</span>
          <input
            type="text"
            name="topic"
            [ngModel]="draftForm.topic"
            (ngModelChange)="updateDraftField('topic', $event)"
            placeholder="Engineering mindset"
          />
        </label>
        <label class="field">
          <span>Status</span>
          <select
            name="status"
            [ngModel]="draftForm.status"
            (ngModelChange)="updateDraftField('status', $event)"
          >
            <option [ngValue]="'Draft'">Draft</option>
            <option [ngValue]="'Ready'">Ready</option>
          </select>
        </label>
        <label class="field writing-form__wide">
          <span>Draft Content</span>
          <textarea
            name="draftContent"
            rows="6"
            [ngModel]="draftForm.content"
            (ngModelChange)="updateDraftField('content', $event)"
            placeholder="Write your post outline or full draft here."
          ></textarea>
        </label>
        <button type="submit" class="finance-button" [disabled]="!isDraftValid">Save Draft</button>
      </form>

      @if (acknowledgementMessage) {
        <p class="writing-feedback">{{ acknowledgementMessage }}</p>
      }

      @if (errorMessage) {
        <p class="error-message">{{ errorMessage }}</p>
      }

      <div class="writing-history">
        <article class="ui-card">
          <span class="writing-label">Recent Diary Entries</span>
          @if (recentDiary.length === 0) {
            <p class="writing-empty">No diary entries yet.</p>
          } @else {
            @for (entry of recentDiary; track entry.id) {
              <div class="history-item">
                <strong>{{ entry.mood }}</strong>
                <p>{{ entry.content }}</p>
                <span>{{ formatDate(entry.createdAt) }}</span>
              </div>
            }
          }
        </article>

        <article class="ui-card">
          <span class="writing-label">Recent Blog Drafts</span>
          @if (recentDrafts.length === 0) {
            <p class="writing-empty">No blog drafts yet.</p>
          } @else {
            @for (draft of recentDrafts; track draft.id) {
              <div class="history-item">
                <div class="history-item__top">
                  <strong>{{ draft.title }}</strong>
                  <span class="ui-chip">{{ draft.status }}</span>
                </div>
                <p>{{ draft.topic }}</p>
                <span>{{ formatDate(draft.updatedAt) }}</span>
                <button type="button" class="training-button" (click)="markReady.emit(draft.id)">
                  Mark Ready
                </button>
              </div>
            }
          }
        </article>
      </div>
    </section>
  `,
  styles: [`
    .writing-panel__subtitle {
      margin: 10px 0 0;
      color: var(--text-muted);
      max-width: 680px;
      line-height: 1.6;
    }

    .writing-prompts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .writing-prompts .ui-card {
      padding: 14px 16px;
      box-shadow: none;
    }

    .writing-label {
      display: block;
      margin-bottom: 8px;
      color: var(--text-muted);
      font-size: 0.78rem;
      letter-spacing: 0.08rem;
      text-transform: uppercase;
    }

    .writing-prompts p {
      margin: 0;
      line-height: 1.55;
      color: var(--text-main);
    }

    .writing-form {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
      margin-bottom: 16px;
      padding: 14px 16px;
      border: 1px solid var(--color-border-soft);
      border-radius: 16px;
      background: var(--card-bg-muted);
    }

    .writing-form h3 {
      grid-column: span 3;
      margin: 0;
      font-size: 1rem;
    }

    .writing-form__wide {
      grid-column: span 3;
    }

    .writing-form .field textarea,
    .writing-form .field select {
      width: 100%;
      min-height: 48px;
      padding: 12px 14px;
      border: 1px solid var(--metal-border);
      border-radius: 14px;
      background: var(--surface-input);
      color: var(--text-main);
      outline: none;
      font: inherit;
    }

    .writing-form .field textarea {
      min-height: 120px;
      resize: vertical;
    }

    .writing-form .field textarea:focus,
    .writing-form .field select:focus {
      border-color: rgba(var(--a), 0.68);
      box-shadow: 0 0 0 3px rgba(var(--a), 0.12);
    }

    .writing-feedback {
      margin: 0 0 12px;
      color: var(--text-muted);
      font-size: 0.88rem;
    }

    .writing-history {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .writing-history .ui-card {
      padding: 14px 16px;
      box-shadow: none;
    }

    .history-item {
      padding: 10px 0;
      border-top: 1px solid var(--color-border-soft);
    }

    .history-item:first-of-type {
      border-top: 0;
      padding-top: 0;
    }

    .history-item strong {
      display: block;
      margin-bottom: 6px;
      line-height: 1.45;
    }

    .history-item p {
      margin: 0 0 6px;
      color: var(--text-muted);
      line-height: 1.55;
    }

    .history-item span {
      color: var(--text-muted);
      font-size: 0.82rem;
    }

    .history-item__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }

    .history-item .training-button {
      margin-top: 8px;
    }

    .writing-empty {
      margin: 0;
      color: var(--text-muted);
      line-height: 1.55;
    }

    @media (max-width: 920px) {
      .writing-form {
        grid-template-columns: 1fr;
      }

      .writing-form h3,
      .writing-form__wide {
        grid-column: span 1;
      }

      .writing-history {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 700px) {
      .writing-prompts {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WritingStudioComponent {
  @Input() reflectionPrompt = '';
  @Input() blogPrompt = '';
  @Input() diaryForm: { mood: string; content: string } = { mood: '', content: '' };
  @Input() draftForm: { title: string; topic: string; content: string; status: BlogDraftStatus } = {
    title: '',
    topic: '',
    content: '',
    status: 'Draft'
  };
  @Input() recentDiary: DiaryEntry[] = [];
  @Input() recentDrafts: BlogDraft[] = [];
  @Input() acknowledgementMessage = '';
  @Input() errorMessage = '';

  @Output() diaryFormChange = new EventEmitter<{ mood: string; content: string }>();
  @Output() draftFormChange = new EventEmitter<{ title: string; topic: string; content: string; status: BlogDraftStatus }>();
  @Output() addDiary = new EventEmitter<void>();
  @Output() addDraft = new EventEmitter<void>();
  @Output() markReady = new EventEmitter<number>();

  get isDiaryValid(): boolean {
    return Boolean(this.diaryForm.mood.trim() && this.diaryForm.content.trim());
  }

  get isDraftValid(): boolean {
    return Boolean(this.draftForm.title.trim() && this.draftForm.topic.trim() && this.draftForm.content.trim());
  }

  updateDiaryField(key: 'mood' | 'content', value: string): void {
    this.diaryFormChange.emit({
      ...this.diaryForm,
      [key]: value
    });
  }

  updateDraftField(
    key: 'title' | 'topic' | 'content' | 'status',
    value: string
  ): void {
    if (key === 'status') {
      this.draftFormChange.emit({
        ...this.draftForm,
        status: value as BlogDraftStatus
      });
      return;
    }

    this.draftFormChange.emit({
      ...this.draftForm,
      [key]: value
    });
  }

  formatDate(value: string): string {
    return new Date(value).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
