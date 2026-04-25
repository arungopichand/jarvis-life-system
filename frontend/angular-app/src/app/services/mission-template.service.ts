import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { MissionTemplate } from '../models/mission-template';

@Injectable({
  providedIn: 'root'
})
export class MissionTemplateService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5197/api/mission-templates';

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
