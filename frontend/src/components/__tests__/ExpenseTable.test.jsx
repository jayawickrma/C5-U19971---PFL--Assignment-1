import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ExpenseTable from '../ExpenseTable.jsx';

const expenses = [
  { id: 1, date: '2026-01-05', cost: 12.5, description: 'Bus fare', expense_type: 'travel' },
  { id: 2, date: '2026-01-06', cost: 8, description: 'Sandwich', expense_type: 'food' },
];

describe('<ExpenseTable />', () => {
  it('shows an empty-state message when there are no expenses', () => {
    render(<ExpenseTable expenses={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/no expenses yet/i)).toBeInTheDocument();
  });

  it('renders one row per expense with formatted currency', () => {
    render(<ExpenseTable expenses={expenses} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Bus fare')).toBeInTheDocument();
    expect(screen.getByText('Sandwich')).toBeInTheDocument();
    expect(screen.getByText('£12.50')).toBeInTheDocument();
  });

  it('calls onEdit with the right expense when its Edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<ExpenseTable expenses={expenses} onEdit={onEdit} onDelete={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: /edit expense: sandwich/i }));

    expect(onEdit).toHaveBeenCalledWith(expenses[1]);
  });

  it('calls onDelete with the right expense when its Delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<ExpenseTable expenses={expenses} onEdit={vi.fn()} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: /delete expense: bus fare/i }));

    expect(onDelete).toHaveBeenCalledWith(expenses[0]);
  });
});
