module.exports = {
  '@stylistic/ts/quotes': ['error', 'single', { avoidEscape: true }],
  '@stylistic/ts/comma-dangle': [
    'error',
    {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      enums: 'always-multiline',
      generics: 'ignore',
      tuples: 'always-multiline',
      functions: 'always-multiline',
    },
  ],
  '@typescript-eslint/indent': 'off', // ['error', 2, { SwitchCase: 1 }],
};
