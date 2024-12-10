import { logger } from '@coze-infra/rush-logger';

import { groupChangedFilesByProject } from '../../utils/project-analyzer';
import { runTsCheck } from './ts-check';
import { runStylelint } from './stylelint';
import { runPackageAudit } from './package-audit';
import { runLint } from './lint';
import { runCommonCommands } from './common-command';

export const incrementlyRunCommands = async (
  changedFiles: string[],
  action: string,
): Promise<void> => {
  if (!changedFiles.length) {
    return;
  }

  const changedFileGroup = groupChangedFilesByProject(changedFiles);
  const packages = Object.keys(changedFileGroup);
  packages.forEach(k => {
    logger.debug(` - ${k}`, false);
  });
  if (packages.length === 0) {
    return;
  }
  switch (action) {
    case 'lint': {
      await runLint(changedFileGroup);
      break;
    }
    case 'style': {
      await runStylelint(changedFileGroup);
      break;
    }
    case 'ts-check': {
      await runTsCheck(changedFileGroup);
      break;
    }
    case 'package-audit': {
      await runPackageAudit(changedFileGroup);
      break;
    }
    default: {
      await runCommonCommands(packages, action);
      break;
    }
  }
};
