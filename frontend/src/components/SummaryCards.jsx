import { EXPENSE_TYPES } from '../constants/expenseTypes';
import { formatCurrency } from '../utils/format';

/** @param {{ summary: { total: number, count: number, byType: Record<string, number> } }} props */
export default function SummaryCards({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Expense summary">
      <SummaryCard label="Total spent" value={formatCurrency(summary.total)} />
      <SummaryCard label="Number of expenses" value={summary.count} />
      {EXPENSE_TYPES.map((type) => (
        <SummaryCard
          key={type.value}
          label={type.label}
          value={formatCurrency(summary.byType[type.value] ?? 0)}
        />
      ))}
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
