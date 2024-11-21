import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { ForecastingService } from '../../services/forecasting.service';

@Component({
  selector: 'app-forecasting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecasting.component.html',
  styleUrl: './forecasting.component.css',
})
export class ForecastingComponent implements OnInit {
  
  private forecastingService = inject(ForecastingService);
  private destroyRef = inject(DestroyRef);

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  date = new Date();
  currentYear = this.date.getFullYear();
  currentMonth = this.date.getMonth();

  forecastChart: Chart | undefined;

  ngOnInit(): void {
    // by default get data for the current month and year
    this.fetchForecast(this.months[this.currentMonth], (this.currentYear).toString());
  }

  fetchForecast(month: string, year: string) {
    const subscription = this.forecastingService.getForecastData(month, year).subscribe({
      next: (data) => {
          this.updateChart(data.weeklyData, data.month, data.year);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  updateChart(data: number[], month: string, year: string) {
    if(this.forecastChart) {
      this.forecastChart.destroy();
    }

    const ctx = document.getElementById('forecastChart') as HTMLCanvasElement;
  
    this.forecastChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: `Predicted Revenue (${month}, ${year})`,
            data: data,
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
        },
      },
    });
  }

  onFilterChange() {
    const monthSelect = document.getElementById('month') as HTMLSelectElement;
    const yearSelect = document.getElementById('year') as HTMLSelectElement;

    const selectedMonth = monthSelect.value;
    const selectedYear = yearSelect.value;

    this.fetchForecast(selectedMonth, selectedYear);
  }
}


