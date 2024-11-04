const { defineConfig } = require('@coze-infra/eslint-config');

module.exports = defineConfig({
  packageRoot: __dirname,
  preset: 'node',
  root: true,
});
