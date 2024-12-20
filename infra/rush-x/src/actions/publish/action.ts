import { logger } from '@coze-infra/rush-logger';

import { randomHash } from '../../utils/random';
import { getRushConfiguration } from '../../utils/project-analyzer';
import { generatePublishManifest } from './version';
import { type PublishOptions } from './types';
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
  logger.debug(
    `Will publish the following packages:\n ${[...packagesToPublish].map(pkg => pkg.packageName).join('\n')}`,
  );

  // 2. 生成发布清单
  const { manifests: publishManifests, isBetaPublish } =
    await generatePublishManifest(packagesToPublish, options);

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
    const effects = await commitChanges({
      sessionId,
      files: changedFiles,
      cwd: rushFolder,
      publishManifests,
    });
    if (!options.skipPush) {
      await pushToRemote(effects, rushFolder);
    }
  }
  logger.success('Publish success.');
};
