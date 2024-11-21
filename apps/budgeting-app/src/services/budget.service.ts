import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type BudgetData = {
    category: string;
    plannedAmount: string;
    actualSpending: string;
};

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
    private apiUrl = 'http://localhost:3000';

    private http: HttpClient = inject(HttpClient);

    getBudgetData() {
        return this.http.get<{budget: BudgetData[]}>(`${this.apiUrl}/budget`)
        .pipe(
          map(response => response.budget)
        );
    }

    updateBudgetData(updatedBudget: BudgetData) {
        return this.http.put<BudgetData>(`http://localhost:3000/budget/${updatedBudget.category}`, updatedBudget);
    }
    
}
