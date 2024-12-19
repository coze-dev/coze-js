import { logger } from '@coze-infra/rush-logger';

import { exec } from '../../utils/exec';

export async function createAndPushBranch(
  branchName: string,
  cwd: string,
): Promise<void> {
  try {
    // 创建新分支
    await exec(`git checkout -b ${branchName}`, { cwd });
    logger.info(`Created new branch: ${branchName}`);

    // 推送到远程
    await exec(`git push -u origin ${branchName}`, { cwd });
    logger.info(`Pushed branch to remote: ${branchName}`);
  } catch (error) {
    throw new Error(`Failed to create/push branch: ${error}`);
  }
}

export async function commitChanges(
  branchName: string,
  files: string[],
  cwd: string,
): Promise<void> {
  await exec(`git checkout -b ${branchName}`, { cwd });
  await exec(`git add ${files.join(' ')}`, { cwd });
  await exec(`git commit -m "chore: Publish ${branchName}"`, { cwd });
}
