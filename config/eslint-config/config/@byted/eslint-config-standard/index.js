const { jsRules: rules, jsxEscapeRules } = require('../eslint-shared-rule');

module.exports = {
  root: true,
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
    requireConfigFile: false,
    babelOptions: {
      plugins: [
        [
          require.resolve('@babel/plugin-proposal-decorators'),
          {
            legacy: true,
          },
        ],
        [
          require.resolve('@babel/plugin-proposal-class-properties'),
          {
            loose: true,
          },
        ],
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        require.resolve('@babel/plugin-proposal-optional-catch-binding'),
        require.resolve('@babel/plugin-proposal-async-generator-functions'),
        require.resolve('@babel/plugin-proposal-export-namespace-from'),
        require.resolve('@babel/plugin-proposal-export-default-from'),
        require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
        require.resolve('@babel/plugin-proposal-optional-chaining'),
        [
          require.resolve('@babel/plugin-proposal-pipeline-operator'),
          {
            proposal: 'minimal',
          },
        ],
        require.resolve('@babel/plugin-proposal-do-expressions'),
        require.resolve('@babel/plugin-proposal-function-bind'),
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        require.resolve('@babel/plugin-syntax-jsx'),
      ],
    },
  },
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    'shared-node-browser': true,
    jest: true,
    mocha: true,
    es2017: true,
    es2020: true,
    worker: true,
  },
  globals: {
    // Global variables of eden-i18n
    __: 'readonly',
    BigInt: 'readonly',
    // Lynx global variables start
    Card: 'readonly',
    Component: 'readonly',
    SystemInfo: 'readonly',
    lynx: 'readonly',
    // Lynx global variables end
  },
  plugins: ['@babel', 'import', 'unicorn', 'react'],
  rules,
  overrides: [
    {
      files: ['**/*.jsx'],
      rules: {
        'react/jsx-uses-react': 'error',
        'react/jsx-uses-vars': 'error',
        ...rules,
        ...jsxEscapeRules,
      },
    },
  ],
};
