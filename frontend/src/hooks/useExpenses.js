import { useCallback, useEffect, useMemo, useState } from 'react';
import { createExpense, deleteExpense, listExpenses, updateExpense } from '../api/expenses';
import { extractErrorMessage } from '../utils/format';

/**
 * Encapsulates all expense CRUD + loading/error state behind one hook, so
 * DashboardPage stays a thin "glue" component instead of a 200-line class
 * mixing data fetching with rendering.
 */
export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await listExpenses();
      setExpenses(data);
    } catch (err) {
      setError(extractErrorMessage(err, 'Could not load your expenses.'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(async (payload) => {
    const created = await createExpense(payload);
    setExpenses((current) => [created, ...current]);
    return created;
  }, []);

  const edit = useCallback(async (id, payload) => {
    const updated = await updateExpense(id, payload);
    setExpenses((current) => current.map((expense) => (expense.id === id ? updated : expense)));
    return updated;
  }, []);

  const remove = useCallback(async (id) => {
    await deleteExpense(id);
    setExpenses((current) => current.filter((expense) => expense.id !== id));
  }, []);

  // Derived totals recomputed only when the underlying list changes -
  // a small demonstration of memoised derived state rather than storing
  // (and having to keep in sync) a second piece of state for totals.
  const summary = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.cost), 0);
    const byType = expenses.reduce((acc, expense) => {
      acc[expense.expense_type] = (acc[expense.expense_type] ?? 0) + Number(expense.cost);
      return acc;
    }, {});
    return { total, byType, count: expenses.length };
  }, [expenses]);

  return { expenses, isLoading, error, summary, refresh, add, edit, remove };
}
