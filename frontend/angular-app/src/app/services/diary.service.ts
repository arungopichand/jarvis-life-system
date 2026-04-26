import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { DiaryEntry } from '../models/diary-entry';

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/diary`;

  createEntry(payload: {
    mood: string;
    content: string;
    reflectionPrompt: string;
  }): Observable<DiaryEntry> {
    return this.http.post<DiaryEntry>(this.apiUrl, payload);
  }

  getRecent(): Observable<DiaryEntry[]> {
    return this.http.get<DiaryEntry[]>(`${this.apiUrl}/recent`);
  }
}
