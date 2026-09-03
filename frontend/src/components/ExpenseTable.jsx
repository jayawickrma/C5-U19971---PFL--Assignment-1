import { badgeClassForType, labelForType } from '../constants/expenseTypes';
import { formatCurrency, formatDate } from '../utils/format';

/**
 * @param {object} props
 * @param {object[]} props.expenses
 * @param {(expense: object) => void} props.onEdit
 * @param {(expense: object) => void} props.onDelete
 */
export default function ExpenseTable({ expenses, onEdit, onDelete }) {
  if (expenses.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        No expenses yet. Add your first one above.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <caption className="sr-only">List of your recorded expenses</caption>
        <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Description</th>
            <th scope="col" className="px-4 py-3">Category</th>
            <th scope="col" className="px-4 py-3 text-right">Cost</th>
            <th scope="col" className="px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td className="whitespace-nowrap px-4 py-3 text-slate-600">{formatDate(expense.date)}</td>
              <td className="px-4 py-3 font-medium text-slate-900">{expense.description}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badgeClassForType(expense.expense_type)}`}
                >
                  {labelForType(expense.expense_type)}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-slate-700">
                {formatCurrency(expense.cost)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <button
                  type="button"
                  onClick={() => onEdit(expense)}
                  className="mr-3 text-brand-600 hover:underline"
                  aria-label={`Edit expense: ${expense.description}`}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(expense)}
                  className="text-red-600 hover:underline"
                  aria-label={`Delete expense: ${expense.description}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
