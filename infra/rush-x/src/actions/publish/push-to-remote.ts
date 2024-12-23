import dayjs from 'dayjs';
import { logger } from '@coze-infra/rush-logger';

import { exec } from '../../utils/exec';
import { type PublishManifest, BumpType } from './types';
import { commitChanges, push } from './git';

interface PushToRemoteOptions {
  sessionId: string;
  changedFiles: string[];
  cwd: string;
  publishManifests: PublishManifest[];
  bumpPolicy: BumpType | string;
  skipCommit: boolean;
  skipPush: boolean;
}

export const pushToRemote = async (options: PushToRemoteOptions) => {
  const {
    sessionId,
    changedFiles,
    cwd,
    publishManifests,
    bumpPolicy,
    skipCommit,
    skipPush,
  } = options;
  if (skipCommit) {
    return;
  }

  const date = dayjs().format('YYYYMMDD');
  const branchName = `release/${date}-${sessionId}`;
  await exec(`git checkout -b ${branchName}`, { cwd });

  // 4. 创建并推送发布分支
  const { effects } = await commitChanges({
    sessionId,
    files: changedFiles,
    cwd,
    publishManifests,
    branchName,
  });
  if (skipPush) {
    return;
  }
  await push(effects, cwd);

  if (bumpPolicy !== BumpType.ALPHA) {
    const prUrl = `https://github.com/coze-dev/coze-js/compare/${branchName}?expand=1`;
    const log = [
      '************************************************',
      '*',
      `* Please create PR: ${prUrl}`,
      '*',
      '************************************************',
    ];
    logger.success(log.join('\n'));
    const open = await import('open');
    await open(prUrl);
  }
  logger.success(
    'Please refer to https://github.com/coze-dev/coze-js/actions/workflows/release.yml for the release progress.',
  );
};
