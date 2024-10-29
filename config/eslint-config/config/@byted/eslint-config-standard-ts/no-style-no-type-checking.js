const {
  tsOffRules,
  tsDeduplicateRules,
  tsNoTypeCheckRules,
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
    projectService: true,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },
  plugins: ['@typescript-eslint'],
  rules: {
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
        ...tsNoTypeCheckRules,
        ...tsDeduplicateRules,
        ...tsNoTypeCheckDeduplicateRules,
        ...tsOffRules,
        ...testEscapeRules,
      },
    },
  ],
};
