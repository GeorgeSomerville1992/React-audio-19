/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, type UserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
// import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/å
export default defineConfig({
  plugins: [react(), tailwindcss()] as UserConfig['plugins'],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
});
