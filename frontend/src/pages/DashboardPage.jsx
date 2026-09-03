import { useState } from 'react';
import ConfirmDialog from '../components/ConfirmDialog';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import SummaryCards from '../components/SummaryCards';
import { useExpenses } from '../hooks/useExpenses';
import { downloadExpensesAsCsv } from '../utils/csv';

export default function DashboardPage() {
  const { expenses, isLoading, error, summary, add, edit, remove } = useExpenses();
  const [editingExpense, setEditingExpense] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const handleCreateOrUpdate = async (payload) => {
    if (editingExpense) {
      await edit(editingExpense.id, payload);
      setEditingExpense(null);
    } else {
      await add(payload);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await remove(pendingDelete.id);
      setPendingDelete(null);
    } catch {
      setDeleteError('Could not delete that expense. Please try again.');
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Your expenses</h1>
        <p className="text-sm text-slate-500">Track spending across travel, food and other costs.</p>
      </div>

      <SummaryCards summary={summary} />

      <section aria-labelledby="expense-form-heading" className="space-y-3">
        <h2 id="expense-form-heading" className="text-lg font-semibold text-slate-900">
          {editingExpense ? 'Edit expense' : 'Add an expense'}
        </h2>
        <ExpenseForm
          key={editingExpense?.id ?? 'new'}
          initialExpense={editingExpense}
          onSubmit={handleCreateOrUpdate}
          onCancel={editingExpense ? () => setEditingExpense(null) : undefined}
        />
      </section>

      <section aria-labelledby="expense-list-heading" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="expense-list-heading" className="text-lg font-semibold text-slate-900">
            History
          </h2>
          <button
            type="button"
            onClick={() => downloadExpensesAsCsv(expenses)}
            disabled={expenses.length === 0}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>

        {deleteError && (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {deleteError}
          </p>
        )}

        {isLoading && (
          <p role="status" className="text-sm text-slate-500">
            Loading expenses…
          </p>
        )}

        {error && (
          <p role="alert" className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <ExpenseTable
            expenses={expenses}
            onEdit={setEditingExpense}
            onDelete={setPendingDelete}
          />
        )}
      </section>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete expense?"
        message={
          pendingDelete
            ? `This will permanently remove "${pendingDelete.description}". This cannot be undone.`
            : ''
        }
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
