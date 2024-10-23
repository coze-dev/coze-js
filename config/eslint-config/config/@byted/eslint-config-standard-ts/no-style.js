const {
  tsOffRules,
  tsDeduplicateRules,
  tsNoTypeCheckRules,
  tsTypeCheckRules,
  tsNoTypeCheckDeduplicateRules,
  tsxEscapeRules,
  testEscapeRules,
} = require('../eslint-shared-rule');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: '../eslint-config-standard',
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    projectService: true,
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
    ...tsTypeCheckRules,
    ...tsNoTypeCheckRules,
    ...tsDeduplicateRules,
    ...tsNoTypeCheckDeduplicateRules,
    ...tsOffRules,
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        'spaced-comment': 'off',
      },
    },
    {
      files: ['**/*.tsx'],
      rules: {
        ...tsTypeCheckRules,
        ...tsNoTypeCheckRules,
        ...tsDeduplicateRules,
        ...tsNoTypeCheckDeduplicateRules,
        ...tsOffRules,
        ...tsxEscapeRules,
      },
    },
    {
      files: [
        '**/*.test.js',
        '**/*.test.ts',
        '**/*.spec.js',
        '**/*.spec.ts',
        '**/*.steps.js',
        '**/*.steps.ts',
      ],
      rules: {
        ...tsTypeCheckRules,
        ...tsNoTypeCheckRules,
        ...tsDeduplicateRules,
        ...tsNoTypeCheckDeduplicateRules,
        ...tsOffRules,
        ...testEscapeRules,
      },
    },
  ],
};
