import path from 'path';

import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  test: {
    globals: true,
    include: ['__tests__/**/*.test.{js,jsx,ts,tsx}'],
    server: {
      deps: {
        inline: ['@tarojs/runtime'],
      },
    },
    setupFiles: './vitest.setup.jsx',
    environment: 'jsdom',
  },
  esbuild: {
    loader: 'tsx',
    include: [/src\/.*\.[jt]sx?$/, /__tests__\/.*\.[jt]sx?$/],
    exclude: /node_modules\/(?!@taro)/,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
