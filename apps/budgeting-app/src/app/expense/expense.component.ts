import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ExpenseData, ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
})
export class ExpenseComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private destroyRef = inject(DestroyRef);

  expenses: ExpenseData[] = [];

  expenseForm: FormGroup;
  isEdit: boolean = false;
  currentExpense: any = null;

  @ViewChild('expenseDialog') expenseDialog: any;

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      category: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.expenseService.getExpenseData().subscribe({
      next: (data) => {
        this.expenses = data
      }
    });
  }

  openDialog(expense: any = null): void {
    if (expense) {
      this.isEdit = true;
      this.currentExpense = expense;
      this.expenseForm.patchValue(expense);
    } else {
      this.isEdit = false;
      this.expenseForm.reset();
    }
    this.expenseDialog.nativeElement.showModal();
  }

  closeDialog(): void {
    this.expenseDialog.nativeElement.close();
  }
  
  category: "Transport" | "Food" | "Misc" = "Transport";
  amount: string = "";
  date: string = "";
  
  onSubmit(): void {
    
      if (this.isEdit) {
        const index = this.expenses.findIndex(e => e.id === this.currentExpense.id);
        if (index !== -1) {
          // this.expenses[index] = { ...this.currentExpense, ...formData };
        }
      } else {
        const newId = Number(Math.random() * 100);
        const newExpense = { id: newId, category: this.category, amount: this.amount, date: this.date };
        const subscription = this.expenseService.addExpense(newExpense).subscribe({
          next: (addedExpense) => {
            this.expenses = [...this.expenses, addedExpense];
          },
          error: (err) => {
            console.error('Error adding new expense:', err);
          }
        });
        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      }

      this.closeDialog();
  }

  editExpense(id: number) {
    const expenseToEdit = this.expenses.find(expense => expense.id === id);

    if (expenseToEdit) {
      this.isEdit = true;

      this.currentExpense = { ...expenseToEdit };

      this.expenseForm.patchValue({
        category: expenseToEdit.category,
        amount: expenseToEdit.amount,
        date: expenseToEdit.date,
      });

      const dialog = document.querySelector('dialog');
      if (dialog) {
        dialog.showModal();
      }
    } else {
      console.error(`Expense with ID ${id} not found.`);
    }
  }

  deleteExpense(id: number): void {
    const subscription = this.expenseService.deleteExpense(id).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(expense => expense.id !== id);
        console.log(`Expense with ID ${id} deleted successfully.`);
      },
      error: (err) => {
        console.error(`Error deleting expense with ID ${id}:`, err);
      }
    });
  
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  
}
