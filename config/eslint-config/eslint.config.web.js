const globals = require('globals');

/** @type {(import('eslint').Linter.Config[])} */
module.exports = [
  ...require('./eslint.config.base.js'),
  {
    plugins: {
      // TODO: 需要根据不同类型配置plugin？需要阅读源码确认是否影响性能
      'react-hooks': require('eslint-plugin-react-hooks'),
      react: require('eslint-plugin-react'),
      risxss: require('eslint-plugin-risxss'),
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        JSX: true,
        React: true,
      },
    },
    settings: {
      // for eslint-plugin-react
      react: {
        pragma: 'React',
        version: '18.2',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'risxss/catch-potential-xss-react': 'error',
    },
  },
];
