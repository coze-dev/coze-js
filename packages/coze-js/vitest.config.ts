import path from 'path';

import { defineConfig } from '@coze-infra/vitest-config';
export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  resolve: {
    alias: {
      '@ws-tools': path.resolve(__dirname, './src/ws-tools'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    testTimeout: 100000,
    coverage: {
      exclude: [
        'rslib.config.ts',
        'src/resources/knowledge/index.ts',
        'src/ws-tools/wavtools',
        'src/ws-tools/recorder/processor',
      ],
    },
  },
});
