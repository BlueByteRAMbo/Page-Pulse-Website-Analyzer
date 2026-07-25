import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    // Allow vi.mock hoisting and CJS interop
    pool: 'forks',
  },
});
