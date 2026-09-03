import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure each test starts from a clean DOM and clean localStorage, since
// the AuthContext reads a token out of localStorage on mount.
afterEach(() => {
  cleanup();
  localStorage.clear();
});
