import apiClient from './client';

/**
 * @param {{ name: string, email: string, password: string, password_confirmation: string }} payload
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function registerUser(payload) {
  const { data } = await apiClient.post('/register', payload);
  return data;
}

/**
 * @param {{ email: string, password: string }} payload
 * @returns {Promise<{ user: object, token: string }>}
 */
export async function loginUser(payload) {
  const { data } = await apiClient.post('/login', payload);
  return data;
}

export async function logoutUser() {
  const { data } = await apiClient.post('/logout');
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await apiClient.get('/me');
  return data;
}
