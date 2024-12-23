import { logger } from '@coze-infra/rush-logger';

import { randomHash } from '../../utils/random';
import { getRushConfiguration } from '../../utils/project-analyzer';
import {
  ensureNotUncommittedChanges,
  isMainBranch,
} from '../../utils/git-command';
import { generatePublishManifest } from './version';
import { type PublishOptions } from './types';
import { BumpType } from './types';
import { pushToRemote } from './push-to-remote';
import { validateAndGetPackages } from './packages';
import { confirmForPublish } from './confirm';
import { generateChangelog } from './changelog';
import { applyPublishManifest } from './apply-new-version';

// 针对不同类型的发布，对应不同 sideEffects：
// 1. alpha: 直接创建并push 分支，触发 CI，执行发布；
// 2. beta: 本分支直接切换版本号，并发布
// 3. 正式版本：发起MR，MR 合入 main 后，触发发布

export const publish = async (options: PublishOptions) => {
  const sessionId = randomHash(6);
  const rushConfiguration = getRushConfiguration();
  const rushFolder = rushConfiguration.rushJsonFolder;
  if (process.env.SKIP_UNCOMMITTED_CHECK !== 'true') {
    await ensureNotUncommittedChanges();
  }

  // 1. 验证并获取需要发布的包列表
  const packagesToPublish = validateAndGetPackages(options);
  if (packagesToPublish.size === 0) {
    logger.error(
      'No packages to publish, should specify some package by `--to` or `--from` or `--only`',
    );
    return;
  }
  logger.debug(
    `Will publish the following packages:\n ${[...packagesToPublish].map(pkg => pkg.packageName).join('\n')}`,
  );

  // 2. 生成发布清单
  const { manifests: publishManifests, bumpPolicy } =
    await generatePublishManifest(packagesToPublish, options);
  const isBetaPublish = [BumpType.BETA, BumpType.ALPHA].includes(
    bumpPolicy as BumpType,
  );
  if (isBetaPublish === false && (await isMainBranch()) === false) {
    // 只允许在主分支发布
    logger.error(
      'You are not in main branch, please switch to main branch and try again.',
    );
    return;
  }

  const continuePublish = await confirmForPublish(
    publishManifests,
    options.dryRun,
  );

  if (!continuePublish) {
    return;
  }

  // 3. 应用更新，注意这里会修改文件，产生 sideEffect
  const postHandles = [applyPublishManifest];
  if (isBetaPublish === false) {
    postHandles.push(generateChangelog);
  }
  const changedFiles = (
    await Promise.all(postHandles.map(handle => handle(publishManifests)))
  ).flat();

  // 4. 创建并推送发布分支
  await pushToRemote({
    publishManifests,
    bumpPolicy,
    sessionId,
    changedFiles,
    cwd: rushFolder,
    skipCommit: options.skipCommit,
    skipPush: options.skipPush,
  });
  logger.success('Publish success.');
};
