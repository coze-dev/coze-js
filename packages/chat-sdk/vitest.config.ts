import path from 'path';

import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  test: {
    globals: true,
    include: ['test/**/*.test.{js,jsx,ts,tsx}'],
    server: {
      deps: {
        inline: ['@tarojs/runtime'],
      },
    },
    setupFiles: './test/vitest.setup.jsx',
    environment: 'jsdom',
  },
  esbuild: {
    loader: 'tsx',
    include: [/src\/.*\.[jt]sx?$/, /test\/.*\.[jt]sx?$/],
    exclude: /node_modules\/(?!@taro)/,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
