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
        'src/actions/audit/audit-lockfile/print-ci-report.ts',
        'src/actions/increment/common-command/report-to-ci.ts',
        'src/actions/increment/stylelint/report.ts',
        'src/actions/flags/utils/generator.ts',
        'src/actions/increment/package-audit/report.ts',
        'src/actions/dup-check/index.ts',
        'src/actions/flags/index.ts',
        'src/actions/flags/utils/sdk.ts',
        'src/actions/flags/types.ts',
        '**/coverage/**',
      ],
    },
    setupFiles: path.resolve(__dirname, './test.setup.ts'),
  },
});
