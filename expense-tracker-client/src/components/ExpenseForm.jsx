import { useEffect, useId, useState } from 'react';
import { EXPENSE_TYPES } from '../constants/expenseTypes';
import { extractErrorMessage, extractValidationErrors } from '../utils/format';

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  cost: '',
  description: '',
  expense_type: EXPENSE_TYPES[0].value,
};

export default function ExpenseForm({ initialExpense = null, onSubmit, onCancel }) {
  const [form, setForm] = useState(() =>
      initialExpense
          ? {
            date: initialExpense.date,
            cost: String(initialExpense.cost),
            description: initialExpense.description,
            expense_type: initialExpense.expense_type,
          }
          : emptyForm
  );
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formId = useId();

  useEffect(() => {
    if (initialExpense) {
      setForm({
        date: initialExpense.date,
        cost: String(initialExpense.cost),
        description: initialExpense.description,
        expense_type: initialExpense.expense_type,
      });
    }
  }, [initialExpense]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors([]);
    setIsSubmitting(true);
    try {
      await onSubmit({ ...form, cost: Number(form.cost) });
      if (!initialExpense) {
        setForm(emptyForm);
      }
    } catch (err) {
      const validationErrors = extractValidationErrors(err);
      setErrors(validationErrors.length ? validationErrors : [extractErrorMessage(err)]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <form
          onSubmit={handleSubmit}
          noValidate
          aria-label={initialExpense ? 'Edit expense' : 'Add a new expense'}
          className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        {errors.length > 0 && (
            <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <ul className="list-inside list-disc">
                {errors.map((message) => (
                    <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor={`${formId}-date`} className="block text-sm font-medium text-slate-700">
              Date
            </label>
            <input
                id={`${formId}-date`}
                type="date"
                required
                value={form.date}
                onChange={handleChange('date')}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label htmlFor={`${formId}-cost`} className="block text-sm font-medium text-slate-700">
              Cost (£)
            </label>
            <input
                id={`${formId}-cost`}
                type="number"
                min="0"
                step="0.01"
                required
                value={form.cost}
                onChange={handleChange('cost')}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-description`} className="block text-sm font-medium text-slate-700">
            Description
          </label>
          <input
              id={`${formId}-description`}
              type="text"
              required
              maxLength={255}
              value={form.description}
              onChange={handleChange('description')}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-type`} className="block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
              id={`${formId}-type`}
              value={form.expense_type}
              onChange={handleChange('expense_type')}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
          >
            {EXPENSE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting ? 'Saving…' : initialExpense ? 'Save changes' : 'Add expense'}
          </button>
          {onCancel && (
              <button
                  type="button"
                  onClick={onCancel}
                  className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
          )}
        </div>
      </form>
  );
}