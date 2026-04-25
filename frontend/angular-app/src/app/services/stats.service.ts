import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { StreakStats } from '../models/streak-stats';
import { WeeklyStats } from '../models/weekly-stats';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/stats`;

  getStreakStats(): Observable<StreakStats> {
    return this.http.get<StreakStats>(`${this.apiUrl}/streak`);
  }

  getWeeklyStats(): Observable<WeeklyStats[]> {
    return this.http.get<WeeklyStats[]>(`${this.apiUrl}/weekly`);
  }
}
