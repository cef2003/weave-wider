import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BudgetData, BudgetService } from '../../services/budget.service';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent implements OnInit {
  
  private budgetService = inject(BudgetService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('editDialog') editDialog: any;

  currentBudget = {
    category: "",
    plannedAmount: "0",
    actualSpending: "0",
  };

  budget: BudgetData[] = [];

  ngOnInit(): void {
    const subscription = this.budgetService.getBudgetData().subscribe({
      next: (data) => {
        this.budget = data;
      }
    });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  openEditDialog(category: string, plannedAmount: string, actualSpending: string) {
    this.currentBudget = { category, plannedAmount, actualSpending };
    this.editDialog.nativeElement.showModal();
  }

  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }

  saveBudget() {
    const updatedBudget: BudgetData = {
      category: this.currentBudget.category,
      plannedAmount: this.currentBudget.plannedAmount,
      actualSpending: this.currentBudget.actualSpending
    };
    console.log('Budget saved:', this.currentBudget);

  const subscription = this.budgetService.updateBudgetData(updatedBudget).subscribe({
    next: (updatedData) => {
      // Update the local budget data to reflect changes
      const index = this.budget.findIndex(b => b.category === updatedBudget.category);
      if (index !== -1) {
        this.budget[index] = updatedBudget;
      }
      console.log('Budget updated successfully:', updatedBudget);
    },
    error: (err) => {
      console.error('Error updating budget:', err);
    }
  });

  this.destroyRef.onDestroy(() => {
    subscription.unsubscribe();
  });
    this.editDialog.nativeElement.close();
  }
}
