import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import Chart from 'chart.js/auto';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  
  private dashboardService = inject(DashboardService);
  private destroyRef = inject(DestroyRef);

  totalExpenses: number = 0;
  totalBudget: number = 0;
  plannedBudget: number = 0;
  actualBudget: number = 0;

  chart: Chart | null = null;

  ngOnInit(): void {
    const subscription = this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.totalExpenses = data.totalExpenses;
        this.totalBudget = data.totalBudget;
        this.plannedBudget = data.plannedBudget;
        this.actualBudget = data.actualBudget;

        // update the chart everytime we fetch data
        if(this.chart) {
          this.chart.data.datasets[0].data = [this.plannedBudget, this.actualBudget];
          this.chart.update();
        }
      },
      error: (err) => {
        console.error('Error fetching dashboard data:', err);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    const ctx = document.getElementById('budgetChart') as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Planned', 'Actual'],
        datasets: [
          {
            label: 'Budget',
            data: [0, 0], // placeholder data
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
