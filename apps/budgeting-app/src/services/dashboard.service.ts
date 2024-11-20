import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { response } from 'express';

type DashboardData = {
  totalExpenses: number;
  totalBudget: number;
  plannedBudget: number;
  actualBudget: number;
};

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
    private apiUrl = 'http://localhost:3000';

    private http: HttpClient = inject(HttpClient);

    getDashboardData() {
        return this.http.get<{dashboard: DashboardData}>(`${this.apiUrl}/dashboard`)
        .pipe(
          map(response => response.dashboard)
        );
    }
}
