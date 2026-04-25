import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { MissionTemplate } from '../models/mission-template';

@Injectable({
  providedIn: 'root'
})
export class MissionTemplateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/mission-templates`;

  getTemplates(): Observable<MissionTemplate[]> {
    return this.http.get<MissionTemplate[]>(this.apiUrl);
  }

  createTemplate(template: MissionTemplate): Observable<MissionTemplate> {
    return this.http.post<MissionTemplate>(this.apiUrl, template);
  }

  updateTemplate(template: MissionTemplate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${template.id}`, template);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
