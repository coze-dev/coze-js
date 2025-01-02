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

/**
 * 从 git 暂存区获取变更内容
 * @returns string[]
 */
export const getChangedFilesFromCached = async (): Promise<string[]> => {
  const output = await exec('git diff --name-only --diff-filter=ACMR --cached');
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

/**
 * 确保没有未提交的变更
 */
export const ensureNotUncommittedChanges = async () => {
  const res = await exec('git status');
  if (res.code !== 0) {
    throw new Error('Failed to check git status');
  }
  if (res.stdout?.includes('git restore')) {
    throw new Error(
      'There are uncommitted changes in the working tree, please commit them first.',
    );
  }
  return true;
};
