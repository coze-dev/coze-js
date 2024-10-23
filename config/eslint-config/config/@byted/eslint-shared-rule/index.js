const jsRules = require('./js');
const jsxEscapeRules = require('./js/jsx-escape');
const jsFileRules = require('./js/file');
const jsStyleRules = require('./js/style');
const jsLanguageFeatureRules = require('./js/language-feature');

const tsRules = require('./ts');
const testEscapeRules = require('./ts/test-escape');
const tsxEscapeRules = require('./ts/tsx-escape');
const tsDeduplicateRules = require('./ts/deduplicate');
const tsNoTypeCheckRules = require('./ts/no-type-checking');
const tsTypeCheckRules = require('./ts/type-check');
const tsStyleRules = require('./ts/style');
const tsNoTypeCheckDeduplicateRules = require('./ts/no-type-checking-deduplicate');
const tsOffRules = require('./ts/ts-feature-off');

module.exports = {
  jsRules,
  jsFileRules,
  jsStyleRules,
  jsLanguageFeatureRules,
  jsxEscapeRules,

  tsRules,
  tsxEscapeRules,
  testEscapeRules,
  tsOffRules,
  tsDeduplicateRules,
  tsNoTypeCheckRules,
  tsTypeCheckRules,
  tsStyleRules,
  tsNoTypeCheckDeduplicateRules,
};
