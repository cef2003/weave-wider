import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type ForecastingData = {
    month: string;
    year: string;
    weeklyData: number[];
};

@Injectable({
  providedIn: 'root',
})
export class ForecastingService {
    private apiUrl = 'http://localhost:3000';

    private http: HttpClient = inject(HttpClient);

    getForecastData(month: string, year: string) {
        return this.http.get<ForecastingData>(`${this.apiUrl}/forecast?month=${month.toLowerCase()}&year=${year}`);
    }
    
}
