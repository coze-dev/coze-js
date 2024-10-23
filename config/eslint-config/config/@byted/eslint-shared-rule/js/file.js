module.exports = {
  'unicorn/filename-case': [
    'warn',
    { cases: { kebabCase: true, snakeCase: true }, ignore: ['^.+\\.jsx$', '^.+\\.tsx$'] },
  ],
  'import/no-duplicates': 'error',
  // 'import/order': 'error',
  'unicorn/no-static-only-class': 'error',
};
