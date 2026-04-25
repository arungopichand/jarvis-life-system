import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Mission } from '../models/mission';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5197/api/missions';

  getTodayMissions(): Observable<Mission[]> {
    return this.http.get<Mission[]>(`${this.apiUrl}/today`);
  }

  completeMission(id: number): Observable<Mission> {
    return this.http.put<Mission>(`${this.apiUrl}/${id}/complete`, {});
  }
}
