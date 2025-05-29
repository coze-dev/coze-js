import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  optimizeDeps: {
    disabled: true, // 禁用依赖优化
  },
  build: {
    rollupOptions: {
      external: ['axios', 'reconnecting-websocket'],
    },
  },
});
