import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { LearningLog, LearningRoadmap, LearningTodayPlan, LearningTopicStatus } from '../models/learning-log';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/learning`;

  addLog(payload: {
    topic: string;
    category: string;
    notes?: string;
    difficulty: number;
    completedAt?: string;
  }): Observable<LearningLog> {
    return this.http.post<LearningLog>(`${this.apiUrl}/log`, payload);
  }

  getTodayPlan(): Observable<LearningTodayPlan> {
    return this.http.get<LearningTodayPlan>(`${this.apiUrl}/today`);
  }

  getRoadmap(): Observable<LearningRoadmap> {
    return this.http.get<LearningRoadmap>(`${this.apiUrl}/roadmap`);
  }

  getRecent(): Observable<LearningLog[]> {
    return this.http.get<LearningLog[]>(`${this.apiUrl}/recent`);
  }

  updateTopicProgress(payload: {
    topic: string;
    category: string;
    status: LearningTopicStatus;
    confidenceLevel: number;
    lastPracticedAt?: string;
  }): Observable<unknown> {
    return this.http.patch(`${this.apiUrl}/topic-progress`, payload);
  }
}
