# @coze-infra/package-audit

## Rules

- [x] Check owners file and verify that the number of reviewers is greater than 2; verify that approve_required value is greater than or equal to 1
- [x] When package.json contains build or test:cov commands, verify correct cache configuration in config/rush-project.json
- [x] Check if basic configuration files exist: eslint/tsconfig/owners
- [ ] Validate package name, must be in the format of `@coze-xxx/xxx`
