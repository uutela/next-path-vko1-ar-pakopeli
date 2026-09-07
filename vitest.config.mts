import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // React Native's own test tooling is Jest-shaped and does not run under
    // Vitest. Component tests therefore render through react-native-web in
    // jsdom — see specs/tech-stack.md for what that does and does not prove.
    alias: {
      'react-native': 'react-native-web',
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    // Remove this once the first real test lands in step 6: it exists so the
    // harness can be verified green before any test is written, and it would
    // otherwise hide a broken include glob.
    passWithNoTests: true,
  },
});
