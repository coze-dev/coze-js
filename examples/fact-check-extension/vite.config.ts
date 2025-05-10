import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        background: resolve(__dirname, 'src/background/main.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: chunkInfo => {
          // 为每个入口点指定特定的输出文件名
          if (chunkInfo.name === 'background') {
            return 'src/background/main.js';
          } else if (chunkInfo.name === 'content') {
            return 'src/content/index.js';
          } else if (chunkInfo.name === 'popup') {
            return 'src/popup/popup.js';
          }
          return 'src/[name]/[name].js';
        },
        chunkFileNames: 'src/[name]/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
  },
});
