import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  expenses = [
    { id: 1, category: 'Food', amount: 100, date: '2024-11-18' },
    { id: 2, category: 'Transport', amount: 50, date: '2024-11-17' }
  ];

  expenseForm: FormGroup;
  isEdit: boolean = false;
  currentExpense: any = null;

  @ViewChild('expenseDialog') expenseDialog: any; // Reference to <dialog>

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Open the <dialog>
  openDialog(expense: any = null): void {
    if (expense) {
      this.isEdit = true;
      this.currentExpense = expense;
      this.expenseForm.patchValue(expense); // Populate form with selected expense data
    } else {
      this.isEdit = false;
      this.expenseForm.reset(); // Clear the form for adding a new expense
    }
    this.expenseDialog.nativeElement.showModal();
  }

  // Close the <dialog>
  closeDialog(): void {
    this.expenseDialog.nativeElement.close();
  }

  // Handle form submission
  onSubmit(): void {
    if (this.expenseForm.valid) {
      const formData = this.expenseForm.value;

      if (this.isEdit) {
        // Update existing expense
        const index = this.expenses.findIndex(e => e.id === this.currentExpense.id);
        if (index !== -1) {
          this.expenses[index] = { ...this.currentExpense, ...formData };
        }
      } else {
        // Add new expense
        const newId = this.expenses.length ? Math.max(...this.expenses.map(e => e.id)) + 1 : 1;
        this.expenses.push({ id: newId, ...formData });
      }

      this.closeDialog(); // Close the dialog after saving
    }
  }

  editExpense(expense: { id: number, category: string, amount: number, date: string }) {
    
  }

  // Delete an expense
  deleteExpense(id: number): void {
    this.expenses = this.expenses.filter(exp => exp.id !== id);
  }
}
