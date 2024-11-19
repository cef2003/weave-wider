import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExpenseComponent } from './expense/expense.component';
import { BudgetComponent } from './budget/budget.component';
import { ForecastingComponent } from './forecasting/forecasting.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: DashboardComponent,
        title: 'Dashboard'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Dashboard'
    },
    {
        path: 'expense',
        component: ExpenseComponent,
        title: 'Expenses'
    },
    {
        path: 'budget',
        component: BudgetComponent,
        title: 'Budget Management'
    },
    {
        path: 'forecasting',
        component: ForecastingComponent,
        title: 'Forecasting'
    }
];
