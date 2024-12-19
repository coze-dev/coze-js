import dayjs from 'dayjs';
import { logger } from '@coze-infra/rush-logger';

import { randomHash } from '../../utils/random';
import { getRushConfiguration } from '../../utils/project-analyzer';
import { generatePublishManifest } from './version';
import { type PublishOptions } from './types';
import { validateAndGetPackages } from './packages';
import { commitChanges } from './git';
import { confirmForPublish } from './confirm';
import { applyPublishManifest } from './apply-new-version';

export const publish = async (options: PublishOptions) => {
  const rushConfiguration = getRushConfiguration();
  const rushFolder = rushConfiguration.rushJsonFolder;

  // 1. 验证并获取需要发布的包列表
  const packagesToPublish = validateAndGetPackages(options);
  logger.debug(
    `Will publish the following packages:\n ${[...packagesToPublish].map(pkg => pkg.packageName).join('\n')}`,
  );

  // 2. 生成发布清单
  const publishManifest = await generatePublishManifest(
    packagesToPublish,
    options,
  );

  const continuePublish = await confirmForPublish(
    publishManifest,
    options.dryRun,
  );

  if (!continuePublish) {
    return;
  }

  // 3. 应用更新
  const changedFiles = await applyPublishManifest(publishManifest);

  // 4. 创建并推送发布分支
  if (!options.skipCommit) {
    const date = dayjs().format('YYYYMMDD');
    const branchName = `release/${date}-${randomHash(6)}`;
    await commitChanges(branchName, changedFiles, rushFolder);
    logger.success(`Successfully created and pushed branch: ${branchName}`);
    logger.success(
      'Now you need to push the branch to remote repository manually, and then create a pull request.',
    );
    logger.success(
      'the ci system will automatically publish according to the pull request.',
    );
  }
};
