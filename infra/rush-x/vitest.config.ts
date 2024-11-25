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
        // 该文件主要用于将 pnpm 信息转换成 ci 上的 md 格式，偏信息展示，变动较大，没太大必要写单测
        'src/actions/audit/audit-lockfile/print-ci-report.ts',
        // 用于解析 rush 日志，定制性较强，未来会替换成直接调用 rush api 的方式
        'src/actions/increment/common-command/report-to-ci.ts',
        'src/actions/increment/stylelint/report.ts',
        'src/actions/flags/utils/generator.ts',
        'src/actions/increment/package-audit/report.ts',
        'src/actions/dup-check/index.ts',
        'src/actions/flags/index.ts',
        // fg接口定义
        'src/actions/flags/utils/sdk.ts',
        'src/actions/flags/types.ts',
        '**/coverage/**',
      ],
    },
    setupFiles: path.resolve(__dirname, './test.setup.ts'),
  },
});
