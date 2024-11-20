import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-forecasting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecasting.component.html',
  styleUrl: './forecasting.component.css',
})
export class ForecastingComponent {
  ngAfterViewInit() {
    const ctx = document.getElementById('forecastChart') as HTMLCanvasElement;
  
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
          {
            label: 'Predicted Revenue',
            data: [1200, 1500, 1100, 1400, 1600, 1800],
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
}


