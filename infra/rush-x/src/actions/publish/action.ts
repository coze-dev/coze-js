import { logger } from '@coze-infra/rush-logger';

import { randomHash } from '../../utils/random';
import { getRushConfiguration } from '../../utils/project-analyzer';
import { generatePublishManifest } from './version';
import { type PublishOptions } from './types';
import { BumpType } from './types';
import { validateAndGetPackages } from './packages';
import { commitChanges, pushToRemote } from './git';
import { confirmForPublish } from './confirm';
import { generateChangelog } from './changelog';
import { applyPublishManifest } from './apply-new-version';

export const publish = async (options: PublishOptions) => {
  const sessionId = randomHash(6);
  const rushConfiguration = getRushConfiguration();
  const rushFolder = rushConfiguration.rushJsonFolder;

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
  const {
    manifests: publishManifests,
    isBetaPublish,
    bumpPolicy,
  } = await generatePublishManifest(packagesToPublish, options);

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
  if (!options.skipCommit) {
    const { effects, branchName } = await commitChanges({
      sessionId,
      files: changedFiles,
      cwd: rushFolder,
      publishManifests,
    });
    if (!options.skipPush) {
      await pushToRemote(effects, rushFolder);
      // 这里还需要进一步优化：
      // 1. 如果是 alpha 版本，直接推送，出发 CI，执行发布
      // 2. beta: 发起MR，MR 合入任意分支后，触发发布
      // 3. 正式版本：发起MR，MR 合入 main 后，触发发布
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
    }
  }
  logger.success('Publish success.');
};
