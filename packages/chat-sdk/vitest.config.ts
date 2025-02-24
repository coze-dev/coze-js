import path from 'path';

import { defineConfig } from '@coze-infra/vitest-config';

export default defineConfig({
  dirname: __dirname,
  preset: 'node',
  test: {
    globals: true,
    include: ['test/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      include: ['src/libs/utils/*.{ts,jsx,js,tsx}'],
      exclude: [
        'src/libs/utils/index.ts',
        'src/libs/utils/mini-coze-api.ts',
        'src/libs/utils/modal.ts',
        'src/libs/utils/webm-to-wav.ts',
        'src/libs/utils/safe-json-parse.ts',
        'src/libs/utils/play-audio.ts',
        'src/libs/utils/decorder.ts',
        'src/libs/utils/get-svg-base64.ts',
        'src/libs/utils/toast.ts',
      ],
    },
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
