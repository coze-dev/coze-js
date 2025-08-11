import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'default',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});
