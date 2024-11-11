import { coverageConfigDefaults, type ViteUserConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export const defaultVitestConfig: ViteUserConfig = {
  plugins: [tsconfigPaths()],
  resolve: {
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
      reporter: ['cobertura', 'text', 'html', 'clover', 'json', 'json-summary'],
    },
  },
};
