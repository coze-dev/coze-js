// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch/modern-module-resolution');

module.exports = {
  extends: ['./.eslintrc.base.js'],
  plugins: ['react-hooks', 'react', 'risxss'],
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  globals: {
    JSX: true,
    React: true,
  },
  settings: {
    react: {
      pragma: 'React',
      version: '18.2',
    },
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'risxss/catch-potential-xss-react': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@douyinfe/semi-ui', '@douyinfe/semi-ui/*'],
            message:
              '请勿直接使用@douyinfe/semi-ui, 请使用 @flow-infra/bot-semi',
          },
          {
            group: ['@douyinfe/semi-ui/lib/es/*'],
            message:
              '如果你的代码为 import { foo } from "@douyinfe/semi-ui/lib/es/bar", 可以尝试替换为 import { foo } from "@flow-infra/bot-semi/Bar"',
          },
          {
            group: ['@edenx/runtime/intl'],
            message: '请勿直接使用@edenx/runtime/intl, 请使用 @flow-infra/i18n',
          },
        ],
      },
    ],
  },
};
