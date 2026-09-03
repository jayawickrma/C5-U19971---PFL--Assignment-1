import apiClient from './client';

// These map 1:1 onto the `Route::apiResource('expenses', ExpenseController::class)`
// routes on the backend, so index/store/update/destroy line up with the
// controller's index/store/update/destroy actions.

/** @returns {Promise<object[]>} array of expense resources */
export async function listExpenses() {
  const { data } = await apiClient.get('/expenses');
  return data.data; // ExpenseResource::collection wraps the array in { data: [...] }
}

/**
 * @param {{ date: string, cost: number, description: string, expense_type: string }} payload
 */
export async function createExpense(payload) {
  const { data } = await apiClient.post('/expenses', payload);
  return data.data;
}

export async function updateExpense(id, payload) {
  const { data } = await apiClient.put(`/expenses/${id}`, payload);
  return data.data;
}

export async function deleteExpense(id) {
  await apiClient.delete(`/expenses/${id}`);
}
