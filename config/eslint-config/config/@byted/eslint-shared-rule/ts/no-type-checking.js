module.exports = {
  '@typescript-eslint/no-misused-new': 'error',
  '@typescript-eslint/no-array-constructor': 'error',
  '@typescript-eslint/ban-ts-comment': [
    'error',
    { 'ts-expect-error': 'allow-with-description' },
  ],
  '@typescript-eslint/consistent-type-assertions': [
    'error',
    { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
  ],
  '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/no-extra-non-null-assertion': 'error',
  '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
  '@typescript-eslint/adjacent-overload-signatures': 'error',
  '@typescript-eslint/no-this-alias': 'error',
  '@typescript-eslint/no-inferrable-types': 'error',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/no-empty-function': 'error',
  '@typescript-eslint/no-empty-interface': 'error',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unnecessary-type-constraint': 'error',
  '@typescript-eslint/no-namespace': 'error',
  '@stylistic/ts/no-extra-semi': 'error',
  '@typescript-eslint/no-loss-of-precision': 'error',
  '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  '@typescript-eslint/no-var-requires': 'off',
  '@typescript-eslint/no-require-imports': 'error',
  '@typescript-eslint/prefer-as-const': 'error',
  '@typescript-eslint/prefer-namespace-keyword': 'off',
  '@typescript-eslint/default-param-last': 'error',
  '@typescript-eslint/no-dupe-class-members': 'error',
  '@typescript-eslint/no-useless-constructor': 'error',
  '@typescript-eslint/unified-signatures': 'error',
  '@typescript-eslint/method-signature-style': 'error',
  '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
  '@typescript-eslint/no-invalid-void-type': 'error',
  '@typescript-eslint/no-magic-numbers': [
    'warn',
    {
      ignoreArrayIndexes: true,
      ignoreDefaultValues: true,
      // 往下两个是 ts 类型的扩展，减少正常使用的误报
      ignoreEnums: true,
      ignoreNumericLiteralTypes: true,
      enforceConst: true,
      ignore: [-1, 0, 1],
      ignoreTypeIndexes: true,
      ignoreReadonlyClassProperties: true,
      ignoreClassFieldInitialValues: true,
    },
  ],
  '@typescript-eslint/prefer-for-of': 'warn',
  '@typescript-eslint/prefer-literal-enum-member': 'error',
  '@typescript-eslint/no-duplicate-enum-values': 'error',
  '@typescript-eslint/no-extraneous-class': 'error',
  '@typescript-eslint/prefer-ts-expect-error': 'error',
  '@typescript-eslint/naming-convention': [
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
      /** TODO: 解决 type check 问题后，可以细粒度到 function 变量, camelCase 就可以去掉 */
      format: ['UPPER_CASE', 'camelCase'],
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
  ],
};
