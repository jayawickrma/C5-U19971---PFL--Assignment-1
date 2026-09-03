import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../AuthContext.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import * as authApi from '../../api/auth.js';
import { getToken } from '../../api/client.js';

vi.mock('../../api/auth.js');

// A tiny consumer component so we can exercise the hook through the DOM,
// the same way real components (LoginPage, Navbar, ...) would use it.
function Harness() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="status">{isAuthenticated ? `in:${user?.name}` : 'out'}</p>
      <button onClick={() => login({ email: 'a@b.com', password: 'secret123' })}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    authApi.fetchCurrentUser.mockResolvedValue({ id: 1, name: 'Ada' });
  });

  it('starts as a guest when no token is stored', async () => {
    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );
    expect(await screen.findByTestId('status')).toHaveTextContent('out');
  });

  it('logs in, stores the token, and exposes the returned user', async () => {
    const user = userEvent.setup();
    authApi.loginUser.mockResolvedValue({ user: { id: 1, name: 'Ada' }, token: 'abc123' });

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );
    await screen.findByTestId('status');

    await user.click(screen.getByText('login'));

    expect(await screen.findByTestId('status')).toHaveTextContent('in:Ada');
    expect(getToken()).toBe('abc123');
  });

  it('clears user and token on logout, even if the request fails', async () => {
    const user = userEvent.setup();
    authApi.loginUser.mockResolvedValue({ user: { id: 1, name: 'Ada' }, token: 'abc123' });
    authApi.logoutUser.mockRejectedValue(new Error('network down'));

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );
    await screen.findByTestId('status');
    await user.click(screen.getByText('login'));
    await screen.findByText('in:Ada');

    await user.click(screen.getByText('logout'));

    expect(await screen.findByTestId('status')).toHaveTextContent('out');
    expect(getToken()).toBeNull();
  });

  it('rehydrates the session from a stored token via GET /me', async () => {
    localStorage.setItem('expense_tracker_token', 'existing-token');

    render(
      <AuthProvider>
        <Harness />
      </AuthProvider>
    );

    expect(await screen.findByTestId('status')).toHaveTextContent('in:Ada');
    expect(authApi.fetchCurrentUser).toHaveBeenCalled();
  });
});
