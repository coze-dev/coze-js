const { defineConfig } = require('@coze-infra/eslint-config');

module.exports = defineConfig({
  packageRoot: __dirname,
  preset: 'node',
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'security/detect-object-injection': 'off',
    'no-inner-declarations': 'off',
    'no-var': 'off',
  },
});
