import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite is used as the build tool/dev server, matching the tool the Laravel
// backend itself already ships with (see backend/vite.config.js), so the
// team only has to reason about one bundler across the stack.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  // Vitest config lives here (single source of truth) instead of a
  // separate vitest.config.js, as recommended by the Vitest docs.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: ['src/main.jsx', 'src/test/**'],
    },
  },
});
