import { beforeEach, describe, expect, it, vi } from 'vitest';
import apiClient from '../client.js';
import { createExpense, deleteExpense, listExpenses, updateExpense } from '../expenses.js';

vi.mock('../client.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('expenses API module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listExpenses unwraps the ExpenseResource collection envelope', async () => {
    apiClient.get.mockResolvedValue({ data: { data: [{ id: 1 }, { id: 2 }] } });

    const result = await listExpenses();

    expect(apiClient.get).toHaveBeenCalledWith('/expenses');
    expect(result).toEqual([{ id: 1 }, { id: 2 }]);
  });

  it('createExpense posts the payload and unwraps the created resource', async () => {
    const payload = { date: '2026-01-01', cost: 5, description: 'Coffee', expense_type: 'food' };
    apiClient.post.mockResolvedValue({ data: { data: { id: 3, ...payload } } });

    const result = await createExpense(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/expenses', payload);
    expect(result).toEqual({ id: 3, ...payload });
  });

  it('updateExpense sends a PUT to the correct id-scoped URL', async () => {
    apiClient.put.mockResolvedValue({ data: { data: { id: 7, description: 'Updated' } } });

    const result = await updateExpense(7, { description: 'Updated' });

    expect(apiClient.put).toHaveBeenCalledWith('/expenses/7', { description: 'Updated' });
    expect(result).toEqual({ id: 7, description: 'Updated' });
  });

  it('deleteExpense sends a DELETE to the correct id-scoped URL', async () => {
    apiClient.delete.mockResolvedValue({});

    await deleteExpense(9);

    expect(apiClient.delete).toHaveBeenCalledWith('/expenses/9');
  });
});
