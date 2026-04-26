import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { DailyProgressToday } from '../models/daily-progress';

@Injectable({
  providedIn: 'root'
})
export class DailyProgressService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/daily-progress`;

  getToday(): Observable<DailyProgressToday> {
    return this.http.get<DailyProgressToday>(`${this.apiUrl}/today`);
  }
}
