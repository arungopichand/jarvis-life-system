import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { DailyGuide } from '../models/daily-guide';

@Injectable({
  providedIn: 'root'
})
export class DailyGuideService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/daily-guide`;

  getToday(): Observable<DailyGuide> {
    return this.http.get<DailyGuide>(`${this.apiUrl}/today`);
  }
}
