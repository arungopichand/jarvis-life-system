import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { BlogDraft, BlogDraftStatus } from '../models/blog-draft';

@Injectable({
  providedIn: 'root'
})
export class BlogDraftService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/blog-drafts`;

  createDraft(payload: {
    title: string;
    topic: string;
    content: string;
    status: BlogDraftStatus;
  }): Observable<BlogDraft> {
    return this.http.post<BlogDraft>(this.apiUrl, payload);
  }

  getRecent(): Observable<BlogDraft[]> {
    return this.http.get<BlogDraft[]>(`${this.apiUrl}/recent`);
  }

  updateDraft(id: number, payload: {
    title?: string;
    topic?: string;
    content?: string;
    status?: BlogDraftStatus;
  }): Observable<BlogDraft> {
    return this.http.patch<BlogDraft>(`${this.apiUrl}/${id}`, payload);
  }
}
