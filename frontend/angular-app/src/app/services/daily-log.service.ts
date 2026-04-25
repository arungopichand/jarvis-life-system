import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { DailyLog } from '../models/daily-log';

@Injectable({
  providedIn: 'root'
})
export class DailyLogService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/dailylog`;

  getTodayLog(): Observable<DailyLog> {
    return this.http.get<DailyLog>(`${this.apiUrl}/today`);
  }

  updateDailyLog(morningCompleted: boolean, nightCompleted: boolean): Observable<DailyLog> {
    return this.http.post<DailyLog>(`${this.apiUrl}/update`, {
      morningCompleted,
      nightCompleted
    });
  }
}
