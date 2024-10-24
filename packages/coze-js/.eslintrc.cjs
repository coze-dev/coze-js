const { defineConfig } = require('@coze-infra/eslint-config');

module.exports = defineConfig({
  packageRoot: __dirname,
  preset: 'node',
  root:true,
  "rules":{"@typescript-eslint/naming-convention":"off"}
});
