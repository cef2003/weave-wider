import fs from "node:fs/promises";
import bodyParser from "body-parser";
import express from 'express';

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});

app.get("/dashboard", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/dashboard-data.json", "utf-8");

  const dashboardData = JSON.parse(fileContent);

  res.status(200).json({ dashboard: dashboardData });
});

app.get("/expense", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/expense-data.json", "utf-8");

  const expenseData = JSON.parse(fileContent);

  res.status(200).json({ expenses: expenseData });
});

app.put("/expense", async (req, res) => {
  try {
    const newExpense = req.body;

    if (!newExpense || !newExpense.id || !newExpense.category || !newExpense.amount || !newExpense.date) {
      return res.status(400).json({ error: "Invalid expense data" });
    }

    // Read the existing expenses from the JSON file
    const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/expense-data.json", "utf-8");
    const expenseData = JSON.parse(fileContent);

    // Check if an expense with the same ID already exists
    if (expenseData.some((expense) => expense.id === newExpense.id)) {
      return res.status(400).json({ error: "Expense with this ID already exists" });
    }

    const updatedExpenses = [...expenseData, newExpense];

    await fs.writeFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/expense-data.json", JSON.stringify(updatedExpenses, null, 2));

    res.status(200).json({ expenses: updatedExpenses });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ error: "Failed to update expenses" });
  }
});

app.put("/expense/:id", async (req, res) => {
  try {
    const expenseId = Number(req.params.id);
    const updatedExpense = req.body;

    const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/expense-data.json", "utf-8");
    const expenses = JSON.parse(fileContent);

    const expenseIndex = expenses.findIndex(expense => expense.id === expenseId);

    if (expenseIndex !== -1) {
      expenses[expenseIndex] = { ...expenses[expenseIndex], ...updatedExpense };

      await fs.writeFile("./data/expense-data.json", JSON.stringify(expenses, null, 2));

      res.status(200).json({ message: "Expense updated successfully", expense: expenses[expenseIndex] });
    } else {
      res.status(404).json({ message: "Expense not found" });
    }
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/expense/:id", async (req, res) => {
  try {
    const expenseId = Number(req.params.id);

    const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/expense-data.json", "utf-8");
    const expenses = JSON.parse(fileContent);

    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);

    if (updatedExpenses.length === expenses.length) {
      return res.status(404).json({ error: "Expense not found" });
    }

    await fs.writeFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/expense-data.json", JSON.stringify(updatedExpenses, null, 2));

    res.status(200).json({ message: "Expense deleted successfully", expenses: updatedExpenses });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Failed to delete expense" });
  }
});

app.get("/budget", async (req, res) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/budget-data.json", "utf-8");

  const budgetData = JSON.parse(fileContent);

  res.status(200).json({ budget: budgetData });
});

app.put("/budget/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const updatedBudget = req.body;

    const fileContent = await fs.readFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/budget-data.json", "utf-8");
    const budgetData = JSON.parse(fileContent);

    const index = budgetData.findIndex(budget => budget.category === category);
    if (index !== -1) {
      budgetData[index] = { ...budgetData[index], ...updatedBudget };

      await fs.writeFile("C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/budget-data.json", JSON.stringify(budgetData, null, 2));
      res.status(200).json(budgetData[index]);
    } else {
      res.status(404).json({ message: "Budget category not found" });
    }
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/forecast", async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    res.status(400).json({ message: "Month and year are required parameters." });
    return;
  }

  try {
    const fileContent = await fs.readFile(
      "C:/Users/Charbel/Desktop/Weave Wider/weave-wider/backend/src/data/forecast-data.json",
      "utf-8"
    );
    const forecastData = JSON.parse(fileContent);

    const result = forecastData.find(
      (entry) =>
        entry.month.toLowerCase() === month &&
        entry.year === year
    );

    if (result) {
      res.status(200).json(result);
    } else {
      res
        .status(404)
        .json({ message: "No forecast data found for the selected month and year." });
    }
  } catch (error) {
    console.error("Error reading forecast data:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});
