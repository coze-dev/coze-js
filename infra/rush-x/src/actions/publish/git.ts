import dayjs from 'dayjs';
import { logger } from '@coze-infra/rush-logger';

import { exec } from '../../utils/exec';
import { type PublishManifest } from './types';

const MAIN_REPO_URL = 'git@github.com:coze-dev/coze-js.git';

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

interface CommitChangesOptions {
  sessionId: string;
  files: string[];
  cwd: string;
  publishManifests: PublishManifest[];
}
export async function commitChanges({
  sessionId,
  files,
  cwd,
  publishManifests,
}: CommitChangesOptions): Promise<string[]> {
  const date = dayjs().format('YYYYMMDD');
  const branchName = `release/${date}-${sessionId}`;

  await exec(`git checkout -b ${branchName}`, { cwd });
  await exec(`git add ${files.join(' ')}`, { cwd });
  await exec(`git commit -m "chore: Publish ${branchName}" -n`, { cwd });

  const tags = publishManifests.map(
    m => `v/${m.project.packageName}@${m.newVersion}`,
  );
  await exec(
    tags.map(tag => `git tag -a ${tag} -m "Bump type ${tag}"`).join(' && '),
    { cwd },
  );
  return [...tags, branchName];
}

export async function pushToRemote(
  effects: string[],
  cwd: string,
): Promise<void> {
  await exec(`git push ${MAIN_REPO_URL} ${effects.join(' ')} --no-verify`, {
    cwd,
  });
}
