import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';

/**
 * Renders `ui` wrapped in the same providers the real app uses
 * (MemoryRouter instead of BrowserRouter so we can control the starting
 * route, and AuthProvider so hooks like useAuth() work in every test).
 *
 * @param {React.ReactElement} ui
 * @param {{ route?: string }} [options]
 */
export function renderWithProviders(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>{ui}</AuthProvider>
    </MemoryRouter>
  );
}

export * from '@testing-library/react';
