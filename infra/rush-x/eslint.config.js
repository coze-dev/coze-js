const { defineConfig } = require('@coze-infra/eslint-config');

module.exports = defineConfig({
  preset: 'node',
  packageRoot: __dirname,
  rules: {
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    'no-restricted-syntax': 'off',
    'consistent-return': 'off',
  },
  overrides: [
    {
      files: ['**/*.{test,spec}.{ts,tsx,js,jsx}'],
      rules: {
        '@coze-infra/no-batch-import-or-export': 'off',
      },
    },
  ],
});
