// TODO: 暂时不对外暴露，等 React 规范 GA
module.exports = {
  'unicorn/filename-case': [
    'warn',
    { cases: { kebabCase: true, snakeCase: true, pascalCase: true }, ignore: ['^(?!.*?\\.jsx$)(?!.*?\\.tsx$).+'] },
  ],
  'max-lines-per-function': ['warn', { max: 300, IIFEs: true }],
};
