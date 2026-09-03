import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExpenseForm from '../ExpenseForm.jsx';

describe('<ExpenseForm />', () => {
  it('submits a well-formed payload with cost coerced to a number', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ExpenseForm onSubmit={onSubmit} />);

    await user.clear(screen.getByLabelText(/description/i));
    await user.type(screen.getByLabelText(/description/i), 'Train ticket');
    await user.clear(screen.getByLabelText(/cost/i));
    await user.type(screen.getByLabelText(/cost/i), '24.50');
    await user.selectOptions(screen.getByLabelText(/category/i), 'travel');

    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const payload = onSubmit.mock.calls[0][0];
    expect(payload.description).toBe('Train ticket');
    expect(payload.cost).toBe(24.5);
    expect(typeof payload.cost).toBe('number');
    expect(payload.expense_type).toBe('travel');
  });

  it('resets the form after a successful create, but not after an edit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<ExpenseForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/description/i), 'Lunch');
    await user.type(screen.getByLabelText(/cost/i), '10');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(screen.getByLabelText(/description/i)).toHaveValue('');
  });

  it('shows backend validation errors returned as a 422 response', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue({
      response: { status: 422, data: { errors: { description: ['The description field is required.'] } } },
    });
    render(<ExpenseForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/cost/i), '10');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/description field is required/i);
  });

  it('pre-fills fields when editing an existing expense', () => {
    const expense = {
      id: 1,
      date: '2026-01-05',
      cost: 12.99,
      description: 'Bus fare',
      expense_type: 'travel',
    };
    render(<ExpenseForm initialExpense={expense} onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText(/description/i)).toHaveValue('Bus fare');
    expect(screen.getByLabelText(/cost/i)).toHaveValue(12.99);
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
