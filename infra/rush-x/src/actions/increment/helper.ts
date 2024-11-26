import { exec } from 'shelljs';
import { logger } from '@coze-infra/rush-logger';

import { isCI } from '../../utils/env';

export const stopProcess = (code: number): void => {
  const ONE_SEC = 1000;
  if (isCI()) {
    setTimeout(() => {
      process.exitCode = code;
      process.exit(code);
      // 1s delay for CI.
    }, ONE_SEC);
  } else {
    process.exitCode = code;
    process.exit(code);
  }
};

const execGitDiffFiles = (branch: string, prefix = 'upstream/'): string[] => {
  const targetBranch = branch.startsWith(prefix)
    ? branch
    : `${prefix}${branch}`;
  const command = `git diff --name-only ${targetBranch}...`;
  logger.info(command);
  const res = exec(command);
  if (res.code === 0) {
    return res.toString().split('\n');
  }
  throw new Error(`Run command failure with error:

${res.stderr.toString()}
  `);
};

export const extractChangedFilesByGitDiff = (branch: string): string[] => {
  logger.info(
    'Please run `git fetch` before this command to ensure up-to-date results',
  );
  try {
    return execGitDiffFiles(branch);
  } catch (e) {
    logger.error((e as Error).message);
    process.exit(1);
  }
};
