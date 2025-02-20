const { defineConfig } = require('@coze-infra/eslint-config');

module.exports = defineConfig({
  // extends: ['taro/react'], // 会带来一些 lint 规则上的冲突，先注释掉
  packageRoot: __dirname,
  preset: 'web',
  rules: {
    '@typescript-eslint/consistent-type-imports': 0,
    'no-restricted-imports': 'off',
    '@typescript-eslint/naming-convention': 'off',
  },
});
