import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type ExpenseData = {
    id: number;
    category: "Transport" | "Food" | "Misc";
    amount: string;
    date: string;
};

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
    private apiUrl = 'http://localhost:3000';

    private http: HttpClient = inject(HttpClient);

    getExpenseData() {
        return this.http.get<{expenses: ExpenseData[]}>(`${this.apiUrl}/expense`)
        .pipe(
          map(response => response.expenses)
        );
    }

    addExpense(newExpense: ExpenseData) {
      return this.http.put<ExpenseData>(`${this.apiUrl}/expense`, newExpense);
    }

    editExpense(id: number, updatedExpense: Partial<ExpenseData>): Observable<ExpenseData> {
      return this.http.put<ExpenseData>(`${this.apiUrl}/expense/${id}`, updatedExpense);
    }

    deleteExpense(id: number) {
      const url = `${this.apiUrl}/expense/${id}`;
      return this.http.delete<void>(url);
    }
    
}
