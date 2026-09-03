import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/test-utils.jsx';
import LoginPage from '../LoginPage.jsx';
import * as authApi from '../../api/auth.js';

vi.mock('../../api/auth.js');

function LoginPageWithRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<p>Dashboard</p>} />
    </Routes>
  );
}

describe('<LoginPage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs the user in and redirects to the dashboard on success', async () => {
    const user = userEvent.setup();
    authApi.loginUser.mockResolvedValue({ user: { id: 1, name: 'Ada' }, token: 'tok' });

    renderWithProviders(<LoginPageWithRoutes />, { route: '/login' });

    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'secret123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
    expect(authApi.loginUser).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'secret123' });
  });

  it('shows an error message and stays on the page when credentials are rejected', async () => {
    const user = userEvent.setup();
    authApi.loginUser.mockRejectedValue({
      response: { status: 401, data: { message: 'The provided credentials are incorrect.' } },
    });

    renderWithProviders(<LoginPageWithRoutes />, { route: '/login' });

    await user.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/credentials are incorrect/i);
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });
});
