const deduplicateRules = require('./deduplicate');
const noTypeCheckRules = require('./no-type-checking');
const typeCheckRules = require('./type-check');
const styleRules = require('./style');
const noTypeCheckDeduplicateRules = require('./no-type-checking-deduplicate');
const offRules = require('./ts-feature-off');

module.exports = {
  ...noTypeCheckRules,
  ...typeCheckRules,
  ...styleRules,
  ...deduplicateRules,
  ...noTypeCheckDeduplicateRules,
  ...offRules,
};
