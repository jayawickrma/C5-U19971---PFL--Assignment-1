import axios from 'axios';

// Single axios instance shared by every API module. Centralising this
// means the base URL, headers and error handling only have to be
// configured once, instead of being duplicated in every fetch call.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
  },
});

const TOKEN_KEY = 'expense_tracker_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

// Attach the Sanctum personal access token (Bearer scheme) to every
// outgoing request, if one is stored.
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A single place to react to an expired/invalid token: clear it and let
// the rest of the app (ProtectedRoute) redirect to /login on next render.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      setToken(null);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
