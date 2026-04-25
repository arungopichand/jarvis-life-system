import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { UserSettings } from '../models/user-settings';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5197/api/settings';

  getSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.apiUrl);
  }

  saveSettings(settings: UserSettings): Observable<UserSettings> {
    return this.http.post<UserSettings>(this.apiUrl, settings);
  }
}
