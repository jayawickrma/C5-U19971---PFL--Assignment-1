import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser, loginUser, logoutUser, registerUser } from '../api/auth';
import { getToken, setToken } from '../api/client';

export const AuthContext = createContext(null);

/**
 * Owns all authentication state for the app. Using React Context here
 * (rather than prop-drilling the user/token through every route) is the
 * idiomatic React pattern for cross-cutting state that many unrelated
 * components need to read (Navbar, ProtectedRoute, DashboardPage, ...).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'authenticated' | 'guest'
  const [error, setError] = useState(null);

  // On first mount, if a token survived a page refresh, verify it against
  // GET /me and rehydrate the user rather than forcing a fresh login.
  useEffect(() => {
    const existingToken = getToken();
    if (!existingToken) {
      setStatus('guest');
      return;
    }

    fetchCurrentUser()
      .then((currentUser) => {
        setUser(currentUser);
        setStatus('authenticated');
      })
      .catch(() => {
        setToken(null);
        setStatus('guest');
      });
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    const { user: loggedInUser, token } = await loginUser(credentials);
    setToken(token);
    setUser(loggedInUser);
    setStatus('authenticated');
    return loggedInUser;
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    const { user: newUser, token } = await registerUser(payload);
    setToken(token);
    setUser(newUser);
    setStatus('authenticated');
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Even if the network call fails (e.g. token already expired),
      // still clear local state so the user isn't stuck.
    } finally {
      setToken(null);
      setUser(null);
      setStatus('guest');
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      isAuthenticated: status === 'authenticated',
      isLoading: status === 'loading',
      login,
      register,
      logout,
    }),
    [user, status, error, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
