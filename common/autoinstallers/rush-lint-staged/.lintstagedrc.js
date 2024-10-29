const {
  excludeIgnoredFiles,
  groupChangedFilesByProject,
  getRushConfiguration,
} = require('./utils');
const micromatch = require('micromatch');
const path = require('path');
const fs = require('fs');

module.exports = {
  '**/*.{ts,tsx,js,jsx,mjs}': async files => {
    const match = micromatch.not(files, [
      '**/common/_templates/!(_*)/**/(.)?*',
    ]);
    const changedFileGroup = await groupChangedFilesByProject(match);
    const eslintCmds = Object.entries(changedFileGroup).map(
      ([packageName, changedFiles]) => {
        const rushConfiguration = getRushConfiguration();
        const { projectFolder } =
          rushConfiguration.getProjectByName(packageName);
        const filesToCheck = changedFiles
          .map(f => path.relative(projectFolder, f))
          .join(' ');
        // TSESTREE_SINGLE_RUN doc https://typescript-eslint.io/packages/parser/#allowautomaticsingleruninference
        return [
          `cd ${projectFolder}`,
          `TSESTREE_SINGLE_RUN=true eslint --fix --cache ${filesToCheck} --no-error-on-unmatched-pattern`,
        ].join(' && ');
      },
    );

    if (!eslintCmds.length) return [];
    return [
      // We can't directly return the eslintCmds array here, because lint-staged would execute each command serially
      // While concurrently will execute multiple commands in parallel
      `concurrently --kill-others-on-fail ${eslintCmds
        .map(r => `"${r}"`)
        .join(' ')}`,
    ];
  },
  '**/*.json': 'prettier --write',
};
