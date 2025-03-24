import { coverageConfigDefaults, type ViteUserConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export const defaultVitestConfig: ViteUserConfig = {
  plugins: [tsconfigPaths()],
  resolve: {
    // 优先识别 main，如果没有配置 main，则识别 module
    mainFields: ['main', 'module', 'exports'],
  },
  server: {
    hmr: {
      port: undefined,
    },
  },
  test: {
    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: 32,
        minForks: 1,
      },
    },
    sequence: {
      // vitest 2.0之后，所有钩子默认串行运行
      hooks: 'parallel',
    },
    globals: true,
    mockReset: false,
    silent: process.env.CI === 'true',
    coverage: {
      all: true,
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: coverageConfigDefaults.exclude,
      provider: 'v8',
      reporter: ['cobertura', 'text', 'html', 'clover', 'json', 'json-summary'],
    },
  },
};
