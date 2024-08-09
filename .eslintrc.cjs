const prettierrc = require('./.prettierrc.cjs');

/** @type {(import('eslint').Linter.Config)} */
module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['import', 'prettier', '@typescript-eslint'],
  globals: {
    NodeJS: true,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  env: {
    browser: false,
    node: true,
    es2020: true,
    jest: true,
  },
  rules: {
    'prettier/prettier': ['warn', prettierrc, { usePrettierrc: false }],
    'import/no-cycle': 'error',
    'max-len': 'off',
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.mjs', '**/*.cjs'],
      parser: '@babel/eslint-parser',
      parserOptions: {
        requireConfigFile: false,
        bebelOptions: {
          babelrc: false,
          configFile: false,
        },
      },
      rules: {
        'no-unused-vars': 'error',
        'no-undef': 'error',
        'no-constant-condition': 'off',
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      excludedFiles: '*.{test|spec}.{ts,tsx,js,jsx}',
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/consistent-type-imports': [
          'error',
          {
            fixStyle: 'inline-type-imports',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'max-len': 'off',
        '@typescript-eslint/max-len': 'off',
      },
      overrides: [
        {
          files: ['**/*.spec.ts', '**/*.test.ts'],
          rules: { '@typescript-eslint/no-explicit-any': 0 },
        },
      ],
    },
  ],
};
