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

  category: "Transport" | "Food" | "Misc" = "Transport";
  amount: string = "";
  date: string = "";

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
      
      this.category = expense.category;
      this.amount = expense.amount;
      this.date = expense.date;
    } else {
      this.isEdit = false;
      this.category = "Transport";
      this.amount = "";
      this.date = "";
    }
    this.expenseDialog.nativeElement.showModal();
  }

  closeDialog(): void {
    this.expenseDialog.nativeElement.close();
  }
  
  onSubmit(): void {
    
      if (this.isEdit) {
        const updatedExpense = {
          ...this.currentExpense,
          category: this.category,
          amount: this.amount,
          date: this.date,
        };

        const subscription = this.expenseService.editExpense(updatedExpense.id, updatedExpense).subscribe({
          next: () => {
            const index = this.expenses.findIndex(
              (expense) => expense.id === this.currentExpense.id
            );
            if (index !== -1) {
              this.expenses[index] = updatedExpense;
            }
            console.log('Expense updated successfully.');
          },
          error: (err) => {
            console.error('Error updating expense:', err);
          },
        });

        this.destroyRef.onDestroy(() => {
          subscription.unsubscribe();
        });
      } else {
        const newId = Math.floor(Math.random() * 100);
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

      // bind data to the form
      this.category = this.currentExpense.category;
      this.amount = this.currentExpense.amount;
      this.date = this.currentExpense.date;

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
