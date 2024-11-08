import { coverageConfigDefaults, type ViteUserConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export const defaultVitestConfig: ViteUserConfig = {
  plugins: [tsconfigPaths()],
  resolve: {
    // 优先识别 main，如果没有配置 main，则识别 module
    mainFields: ['main', 'module', 'exports'],
  },
  test: {
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
    globals: true,
    mockReset: false,
    silent: process.env.CI === 'true',
    coverage: {
      all: true,
      exclude: coverageConfigDefaults.exclude,
      provider: 'v8',
      reporter: ['text', 'html', 'clover', 'json', 'v8', 'istanbul'],
    },
  },
};
