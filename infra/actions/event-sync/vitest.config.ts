import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  test: {
    coverage: {
      all: true,
      exclude: [
        'src/tsx-index.js',
        'src/index.ts',
        'lib/index.js',
        'src/types.ts',
      ],
    },
  },
});
