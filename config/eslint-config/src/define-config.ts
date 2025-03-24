import path from 'path';
import fs from 'fs';

import type { Linter } from 'eslint';
import { includeIgnoreFile } from '@eslint/compat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

type ESLintConfigMode = 'web' | 'node' | 'base';

type ESLintConfig = Linter.Config;

type Rules = Linter.RulesRecord;

export interface EnhanceESLintConfig extends ESLintConfig {
  /**
   * project root dir
   */
  packageRoot: string;
  /**
   * config mode
   */
  preset: ESLintConfigMode;
  /** overrides config */
  overrides: ESLintConfig[];
}

/**
 * Define an ESLint config.
 *
 * @param config ESLint config.
 * @returns ESLint config.
 */
export const defineConfig = (config: EnhanceESLintConfig): ESLintConfig[] => {
  const {
    packageRoot,
    preset,
    overrides = [],
    ignores = [],
    rules,
    settings,

    ...userConfig
  } = config;

  if (!packageRoot) {
    throw new Error('should provider "packageRoot" params');
  }

  const defaultRules: Rules = {};

  const ignorePath = path.resolve(packageRoot, '.gitignore');

  return [
    ...require(`../eslint.config.${preset}.js`),

    fs.existsSync(ignorePath) ? includeIgnoreFile(ignorePath) : {},
    // root ignore file
    includeIgnoreFile(path.resolve(__dirname, '../../../.gitignore')),

    {
      ignores,
    },

    {
      files: ['**/*.?(m|c)?(j|t)s?(x)'],
      settings: {
        ...settings,
        // 'import/resolver': {
        //   typescript: {
        //     project: packageRoot,
        //     extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        //   },
        // },
        'import-x/resolver-next': [
          createTypeScriptImportResolver({
            alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`

            // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json by default

            // use <root>/path/to/folder/tsconfig.json
            project: packageRoot,
          }),
        ],
      },
      plugins: {},
      rules: {
        ...defaultRules,
        ...rules,
      },
      ...userConfig,
    },
    ...overrides,
  ];
};
