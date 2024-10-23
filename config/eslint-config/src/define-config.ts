import path from 'path';

import type { ESLintConfig, Rules } from 'eslint-define-config';

import { includeIgnoreFile } from './ignore-files';

type ESLintConfigMode = 'web' | 'node' | 'base';

export interface EnhanceESLintConfig extends ESLintConfig {
  /**
   * project root dir
   */
  packageRoot: string;
  /**
   * config mode
   */
  preset: ESLintConfigMode;
}

/**
 * Define an ESLint config.
 *
 * @param config ESLint config.
 * @returns ESLint config.
 */
export const defineConfig = (config: EnhanceESLintConfig): ESLintConfig => {
  const {
    packageRoot,
    preset,
    settings,
    extends: extendsCfg = [],
    rules = {},
    ...userConfig
  } = config;
  if (!packageRoot) {
    throw new Error('should provider "packageRoot" params');
  }

  const defaultRules: Rules = {};

  return {
    extends: [
      path.resolve(__dirname, `../.eslintrc.${preset}.js`),
      ...extendsCfg,
    ],
    ignorePatterns: [...includeIgnoreFile(packageRoot)],
    settings: {
      ...settings,
      'import/resolver': {
        typescript: {
          project: packageRoot,
        },
      },
    },
    rules: {
      ...defaultRules,
      ...rules,
    },
    ...userConfig,
  };
};
