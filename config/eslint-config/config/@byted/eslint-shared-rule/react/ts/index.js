// TODO: 暂时不对外暴露，等 React 规范 GA
const reactJSRules = require('../js');

module.exports = {
  ...reactJSRules,
  '@typescript-eslint/naming-convention': [
    // 临时方案，为了特殊处理 react 函数式组件使用大写字母开头的情况
    'warn',
    /**
     * 函数和方法名使用 lowerCamelCase
     * 对 UPPER_CASE 常量命名进行兼容，规则无法处理
     * https://devspec.bytedance.net/codespecs/bytedance_javascript#function-like-naming
     * 变量、参数和属性名使用 lowerCamelCase
     * https://devspec.bytedance.net/codespecs/bytedance_javascript#variable-like-naming
     */
    {
      selector: ['default', 'variableLike'],
      format: ['camelCase', 'UPPER_CASE'],
    },
    /**
     * 类、接口和类型名使用 UpperCamelCase
     *  https://devspec.bytedance.net/codespecs/bytedance_javascript#type-like-naming
     */
    {
      selector: ['class', 'interface', 'typeLike'],
      format: ['PascalCase'],
    },
    /**
     * 全局常量名使用 UPPER_SNAKE_CASE，但首尾不能有下划线
     * https://devspec.bytedance.net/codespecs/bytedance_javascript#constant-naming
     */
    {
      selector: ['variable'],
      /** TODO: 解决 type check 问题后，可以细粒度到 function 变量, camelCase, PascalCase 就可以去掉 */
      format: ['UPPER_CASE', 'camelCase', 'PascalCase'],
      modifiers: ['global', 'exported'],
    },
    /**
     *  不约束对象字面量的属性命名
     */
    {
      selector: 'objectLiteralProperty',
      format: null,
    },
    /**
     * 枚举值命名使用 UpperCamelCase 或 UPPER_SNAKE_CASE
     * https://devspec.bytedance.net/codespecs/bytedance_typescript#enum-naming
     */

    {
      selector: 'enumMember',
      format: ['UPPER_CASE', 'PascalCase'],
    },
    /**
     * 规范内容待同步
     */
    {
      selector: 'typeProperty',
      format: ['camelCase', 'snake_case'],
    },
    {
      selector: 'parameter',
      format: ['camelCase'],
      leadingUnderscore: 'allow',
      trailingUnderscore: 'forbid',
    },
    /** 变量解构不约束 */
    {
      selector: 'variable',
      modifiers: ['destructured'],
      format: [
        'camelCase',
        'PascalCase',
        'snake_case',
        'strictCamelCase',
        'StrictPascalCase',
        'UPPER_CASE',
      ],
    },
    /**
     * import 不做限制
     */
    {
      selector: 'import',
      format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    },
    /**
     * jsx tsx 文件函数允许大驼峰
     */
    { selector: 'function', format: ['camelCase', 'PascalCase'] },
    {
      selector: 'variable',
      format: ['camelCase', 'PascalCase'],
      /** TODO: 解决 type check 问题后，可以细粒度到 function 变量 */
      // types: ['function']
    },
  ],
};
