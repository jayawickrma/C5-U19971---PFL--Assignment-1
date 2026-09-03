import { labelForType } from '../constants/expenseTypes';

/**
 * Builds a CSV Blob from the current expense list and triggers a browser
 * download. This is a self-contained "future feature" (see README ->
 * Future Features): the business need is "let me export my expenses for
 * my own records / a spreadsheet", and it needs no new backend endpoint
 * since the data is already loaded client-side.
 *
 * @param {object[]} expenses
 */
export function downloadExpensesAsCsv(expenses) {
  const header = ['Date', 'Description', 'Category', 'Cost (GBP)'];
  const rows = expenses.map((expense) => [
    expense.date,
    csvEscape(expense.description),
    labelForType(expense.expense_type),
    Number(expense.cost).toFixed(2),
  ]);

  const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function csvEscape(value) {
  const stringValue = String(value ?? '');
  return /[",\n]/.test(stringValue) ? `"${stringValue.replace(/"/g, '""')}"` : stringValue;
}
