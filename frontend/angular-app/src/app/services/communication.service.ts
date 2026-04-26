import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { CommunicationLog, CommunicationTodayPlan } from '../models/communication-log';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/communication`;

  addLog(payload: {
    type: string;
    content: string;
    confidenceLevel: number;
    notes?: string;
  }): Observable<CommunicationLog> {
    return this.http.post<CommunicationLog>(`${this.apiUrl}/log`, payload);
  }

  getToday(): Observable<CommunicationTodayPlan> {
    return this.http.get<CommunicationTodayPlan>(`${this.apiUrl}/today`);
  }

  getRecent(): Observable<CommunicationLog[]> {
    return this.http.get<CommunicationLog[]>(`${this.apiUrl}/recent`);
  }
}
