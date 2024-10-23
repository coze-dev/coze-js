const fileRules = require('./file');
const styleRules = require('./style');
const languageFeatureRules = require('./language-feature');

module.exports = {
  ...fileRules,
  ...styleRules,
  ...languageFeatureRules,
};
