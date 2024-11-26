import path from 'node:path';

import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  test: {
    coverage: {
      all: true,
      provider: 'v8',
      include: ['src'],
      exclude: [
        'src/debug.ts',
        'src/index.ts',
        'src/types.ts',
        'src/actions/index.ts',
        'src/actions/increment/index.ts',
        'src/actions/increment/package-audit/index.ts',
        'src/utils/env.ts',
        'src/actions/increment/ts-check/worker.js',
        'src/utils/logger.ts',
        'src/utils/exec.ts',
        '**/coverage/**',
      ],
    },
    setupFiles: path.resolve(__dirname, './test.setup.ts'),
  },
});
