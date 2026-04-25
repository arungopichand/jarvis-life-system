import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { MissionHistoryDay } from '../models/mission-history';
import { Mission } from '../models/mission';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/missions`;

  getTodayMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}/today`);
  }

  getMissionHistory(days: number): Observable<MissionHistoryDay[]> {
    return this.http.get<MissionHistoryDay[]>(`${this.apiUrl}/history?days=${days}`);
  }

  completeMission(id: number): Observable<Mission> {
    return this.http.put<Mission>(`${this.apiUrl}/${id}/complete`, {});
  }
}
