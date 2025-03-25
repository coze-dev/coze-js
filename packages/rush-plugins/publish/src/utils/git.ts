import { exec } from './exec';

const serializeFilesName = (output: string): string[] =>
  output
    .split('\n')
    .map(line => {
      if (line) {
        const trimmedLine = line.trim();
        return trimmedLine;
      }
      return '';
    })
    .filter(line => line && line.length > 0);

export const getChangedFilesFromCached = async (): Promise<string[]> => {
  const output = await exec('git diff --name-only --diff-filter=ACMR --cached');
  if (!output) {
    return [];
  }
  return serializeFilesName(output.stdout);
};

/**
 * 获取当前分支名称
 * @returns string
 */
export const getCurrentBranchName = async () => {
  const { stdout } = await exec('git rev-parse --abbrev-ref HEAD');
  return stdout.trim();
};

export const isMainBranch = async () => {
  const currentBranchName = await getCurrentBranchName();
  return currentBranchName === 'main';
};

export const getChangedFiles = async (): Promise<string[]> => {
  const output = await exec('git diff --name-only --diff-filter=ACMR');
  return serializeFilesName(output.stdout);
};

/**
 * 确保没有未提交的变更
 */
export const ensureNotUncommittedChanges = async () => {
  const changedFiles = (
    await Promise.all([getChangedFilesFromCached(), getChangedFiles()])
  ).flat();
  if (changedFiles.length > 0) {
    throw new Error(
      'There are uncommitted changes in the working tree, please commit them first.',
    );
  }
  return true;
};
