// Documentation for this file: https://prettier.io/docs/en/options.html
module.exports = {
  // We use a larger print width because Prettier's word-wrapping seems to be tuned
  // for plain JavaScript without type annotations
  printWidth: 150,

  // Use .gitattributes to manage newlines
  endOfLine: 'auto',

  semi: true,

  plugins: [require.resolve('prettier-plugin-packagejson')],

  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  trailingComma: 'all',
  bracketSpacing: true,
  jsxBracketSameLine: false,
  arrowParens: 'avoid',
  overrides: [
    {
      files: '*.json',
      options: { trailingComma: 'none' },
    },
  ],
};
