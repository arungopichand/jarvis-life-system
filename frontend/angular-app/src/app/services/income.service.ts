import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { IncomeLog, IncomeMonthSummary } from '../models/income-log';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/api/income`;

  createIncome(payload: {
    source: string;
    amount: number;
    notes?: string;
  }): Observable<IncomeLog> {
    return this.http.post<IncomeLog>(this.apiUrl, payload);
  }

  getRecent(): Observable<IncomeLog[]> {
    return this.http.get<IncomeLog[]>(`${this.apiUrl}/recent`);
  }

  getMonthSummary(): Observable<IncomeMonthSummary> {
    return this.http.get<IncomeMonthSummary>(`${this.apiUrl}/month-summary`);
  }
}
