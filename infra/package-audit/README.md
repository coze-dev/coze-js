# @coze-infra/package-audit

## Rules

- [x] 检测 owners 文件并检测 reviewers 是否大于 2； approve_required 属性值是否大于等于 1；
- [x] 判断 package.json 中 有 build or test:cov 命令时，是否在 config/rush-project.json 中正确配置缓存；
- [x] 检测项目中是否有基础配置文件：eslint/tsconfig/owners
- [ ] 校验 package 名称，要求符合 `@flow-xxx/xxx` 规则；
