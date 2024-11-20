import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent {
  @ViewChild('editDialog') editDialog: any;

  currentBudget = {
    category: '',
    plannedAmount: 0,
    actualSpending: 0,
  };

  openEditDialog(category: string, plannedAmount: number, actualSpending: number) {
    this.currentBudget = { category, plannedAmount, actualSpending };
    this.editDialog.nativeElement.showModal();
  }

  closeDialog(dialog: HTMLDialogElement) {
    dialog.close();
  }

  saveBudget() {
    console.log('Budget saved:', this.currentBudget);
    this.editDialog.nativeElement.close();
  }
}
