import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  test: {
    coverage: {
      exclude: ['src/rules/index.ts'],
      all: true,
    },
  },
});
