const {
  tsRules: rules,
  tsxEscapeRules,
  testEscapeRules,
} = require('../eslint-shared-rule');

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['../eslint-config-standard'],
  parserOptions: {
    ecmaVersion: 11,
    projectService: true,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },
  plugins: ['@typescript-eslint', '@stylistic/ts'],
  rules,
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        'spaced-comment': 'off',
      },
    },
    {
      files: ['**/*.ts'],
      rules,
    },
    {
      files: ['**/*.tsx'],
      rules: {
        ...rules,
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
        ...rules,
        ...testEscapeRules,
      },
    },
  ],
};
