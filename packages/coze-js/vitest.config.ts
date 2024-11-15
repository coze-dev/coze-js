import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  test: {
    testTimeout: 100000,
    coverage: {
      exclude: ['rslib.config.ts'],
    },
  },
});
