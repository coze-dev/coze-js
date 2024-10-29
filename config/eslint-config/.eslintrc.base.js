// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

const prettierrc = require('./.prettierrc');

const babelPlugins = [
  [
    '@babel/plugin-proposal-decorators',
    {
      legacy: true,
    },
  ],
  [
    '@babel/plugin-proposal-class-properties',
    {
      loose: true,
    },
  ],
  '@babel/plugin-proposal-object-rest-spread',
  '@babel/plugin-proposal-optional-catch-binding',
  '@babel/plugin-proposal-async-generator-functions',
  '@babel/plugin-proposal-export-namespace-from',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-nullish-coalescing-operator',
  '@babel/plugin-proposal-optional-chaining',
  [
    '@babel/plugin-proposal-pipeline-operator',
    {
      proposal: 'minimal',
    },
  ],
  '@babel/plugin-proposal-do-expressions',
  '@babel/plugin-proposal-function-bind',
  '@babel/plugin-syntax-dynamic-import',
  '@babel/plugin-syntax-jsx',
];

/** @type {(import('eslint').Linter.Config)} */
module.exports = {
  extends: [
    'prettier',
    './config/import.json',
    './config/no-restricted-syntax.json',
  ],
  plugins: ['prettier', '@babel', 'import', 'unicorn', '@typescript-eslint'],
  ignorePatterns: [
    '**/*.d.ts',
    '**/coverage',
    '**/node_modules',
    '**/build',
    '**/dist',
    '**/es',
    '**/lib',
    '**/.codebase',
    '**/.changeset',
    '**/config',
    '**/common/scripts',
    '**/output',
    'error-log-str.js',
    '*.bundle.js',
    '*.min.js',
    '*.js.map',
    '**/output',
    '**/*.log',
    '**/tsconfig.tsbuildinfo',
  ],
  rules: {
    'prettier/prettier': ['warn', prettierrc, { usePrettierrc: false }],
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.mjs', '**/*.jsx'],
      extends: [
        './config/@byted/eslint-config-standard',
        './config/js-standard-rules.json',
      ],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        bebelOptions: {
          babelrc: false,
          configFile: false,
          plugins: babelPlugins,
        },
      },
      settings: {
        'import/resolver': {
          node: {
            moduleDirectory: ['node_modules', 'src'],
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
          },
        },
      },
      rules: {
        // 'unicorn/filename-case': 'off',
        // 'no-unused-vars': 'error',
      },
      overrides: [
        {
          files: ['**/*.jsx'],
          extends: ['./config/jsx-standard-rules.json'],
        },
      ],
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        './config/@byted/eslint-config-standard-ts',
        './config/ts-standard-rules.json',
      ],
      excludedFiles: '*.{test|spec}.{ts,tsx,js,jsx}',
      rules: {
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            fixStyle: 'inline-type-imports',
          },
        ],
        // '@typescript-eslint/no-unused-vars': [
        //   'error',
        //   {
        //     vars: 'all',
        //     args: 'none', // function arguments should not force to match this rule.
        //     ignoreRestSiblings: false,
        //     argsIgnorePattern: '^_', // 规范允许下划线
        //   },
        // ],

        // 这些规则都是从 packages/config/.eslintrc.react.js 复制迁移过来
        // 后续在做调整
        '@typescript-eslint/no-redundant-type-constituents': 0,
        '@typescript-eslint/no-throw-literal': 'off',
        // 'unicorn/filename-case': 'off', 规范为准
        '@typescript-eslint/no-unnecessary-condition': 0,
        '@typescript-eslint/prefer-optional-chain': 0,
        // 'arrow-body-style': 0, 规范为准
        '@typescript-eslint/indent': 0,
        // '@typescript-eslint/explicit-module-boundary-types': 0,
        // '@typescript-eslint/no-explicit-any': 2,
        // '@typescript-eslint/consistent-type-definitions': 'off',
        '@babel/new-cap': 'off',
        '@byted/prettier/prettier': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        // 'max-lines-per-function': 'off', 规范为准
        // '@typescript-eslint/no-empty-function': 'off', 规范为准
        // '@typescript-eslint/no-empty-interface': 'off', 规范为准
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        // '@typescript-eslint/ban-types': 'off', 规范为准
        // '@typescript-eslint/ban-ts-comment': 'off', 规范为准

        'import/no-cycle': 'error',
        // '@typescript-eslint/no-useless-constructor': 0, 规范为准
        '@typescript-eslint/prefer-string-starts-ends-with': 0,
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 0,
        '@typescript-eslint/no-implied-eval': 0, // warning
        // '@typescript-eslint/no-non-null-assertion': 0, 规范为准
        // '@typescript-eslint/no-invalid-void-type': 0, 规范为准
      },
      overrides: [
        {
          files: ['**/*.tsx'],
          extends: ['./config/tsx-standard-rules.json'],
        },
      ],
    },
    {
      files: ['*.{test,spec}.{ts,tsx}'],
      extends: ['./config/test-standard-rules.json'],
      rules: {
        'no-restricted-syntax': 'off',
        'import/no-named-as-default-member': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'max-lines-per-function': 'off',
      },
      globals: {
        vi: 'readonly',
      },
    },
  ],
};
