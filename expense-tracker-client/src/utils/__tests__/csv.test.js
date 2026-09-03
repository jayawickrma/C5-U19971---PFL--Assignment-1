import { beforeEach, describe, expect, it, vi } from 'vitest';
import { downloadExpensesAsCsv } from '../csv.js';

const expenses = [
  { date: '2026-01-01', description: 'Taxi, airport', expense_type: 'travel', cost: 15 },
  { date: '2026-01-02', description: 'Lunch "special"', expense_type: 'food', cost: 6.5 },
];

describe('downloadExpensesAsCsv', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    URL.revokeObjectURL = vi.fn();
  });

  it('creates and clicks a download link pointing at a CSV blob', () => {
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

    downloadExpensesAsCsv(expenses);

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    const [blobArg] = URL.createObjectURL.mock.calls[0];
    expect(blobArg.type).toBe('text/csv;charset=utf-8;');
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');

    clickSpy.mockRestore();
  });
});
