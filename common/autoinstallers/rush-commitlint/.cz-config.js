const chalk = require('chalk');
const spawn = require('cross-spawn');
const defaultConfig = require('cz-customizable');
const { getChangedPackages } = require('./utils');

const typesConfig = [
  { value: 'feat', name: 'A new feature' },
  { value: 'fix', name: 'A bug fix' },
  { value: 'docs', name: 'Documentation only changes' },
  {
    value: 'style',
    name: 'Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)',
  },
  {
    value: 'refactor',
    name: 'A code change that neither fixes a bug nor adds a feature',
  },
  {
    value: 'perf',
    name: 'A code change that improves performance',
  },
  { value: 'test', name: 'Adding missing tests' },
  {
    value: 'chore',
    name: 'Changes to the build process or auxiliary tools',
  },
  {
    value: 'build',
    name: 'Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)',
  },
  {
    value: 'ci',
    name: 'Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)',
  },
  {
    value: 'revert',
    name: 'Reverts a previous commit',
  },
];

const { stdout = '' } = spawn.sync(`git diff --staged --name-only`, {
  shell: true,
  encoding: 'utf8',
  stdio: 'pipe',
});
const changedFiles = stdout.split('\n').filter(Boolean);
const changeSet = getChangedPackages(changedFiles);

if (changeSet.size > 1) {
  process.stderr.write(
    `${[
      chalk.yellow(
        `Multiple packages detected in current commit, please consider splitting into smaller commits`,
      ),
    ].join('\n')}\n`,
  );

  changeSet.clear();
  changeSet.add('multiple');
}

const changedScopes = [...changeSet];

module.exports = {
  ...defaultConfig,
  types: typesConfig.map(({ value, name }) => {
    return {
      name: `${value}:${new Array(10 - value.length)
        .fill(' ')
        .join('')}${name}`,
      value,
    };
  }),
  messages: {
    ...defaultConfig.messages,
    type: "Select the type of change that you're committing",
    scope: 'Ensure the scope of this change',
    subject: 'Write a short, imperative tense description of the change',
    body: 'Provide a longer description of the change. Use "|" to break new line:\n',
    breaking: 'List any BREAKING CHANGES (optional):\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },
  scopes: changedScopes.join(','),
  allowCustomScopes: false,
  skipQuestions: ['customScope', 'footer', 'body'],
  allowBreakingChanges: ['feat', 'fix'],
};
