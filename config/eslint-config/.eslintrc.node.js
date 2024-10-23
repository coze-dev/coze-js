// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

/** @type {(import('eslint').Linter.Config)} */
module.exports = {
  extends: ['./.eslintrc.base.js', 'plugin:security/recommended-legacy'],
  plugins: ['security'],
  globals: {
    NodeJS: true,
  },
  env: {
    browser: false,
    node: true,
    es2020: true,
    jest: true,
  },
  rules: {},
};
