import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  ngAfterViewInit() {
    const ctx = document.getElementById('budgetChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Planned', 'Actual'],
        datasets: [
          {
            label: 'Budget',
            data: [5000, 3000], // Replace with dynamic data
            backgroundColor: ['#4CAF50', '#FF5733'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }
}
