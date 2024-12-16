import { defineConfig, getRslibConfig } from '@coze-infra/rslib-config';
export default defineConfig(
  getRslibConfig({
    format: ['esm', 'cjs', 'umd'],
    umdName: 'CozeRealtimeApi',
  }),
);
