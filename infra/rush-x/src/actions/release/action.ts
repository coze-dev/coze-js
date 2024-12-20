import { logger } from '@coze-infra/rush-logger';

import { exec } from '../../utils/exec';
import { type ReleaseOptions } from './types';
import { releasePackages } from './release';
import { buildReleaseManifest } from './manifest';
import { getPackagesToPublish } from './git';

export async function release(options: ReleaseOptions): Promise<void> {
  const {
    commit,
    dryRun = false,
    registry = 'https://registry.npmjs.org',
  } = options;

  await exec(`git checkout ${commit}`);

  // 1. 获取需要发布的包列表
  const packagesToPublish = await getPackagesToPublish(commit);
  if (packagesToPublish.length === 0) {
    logger.warning('No packages to publish');
    return;
  }

  // 2. 构建发布依赖树
  const releaseManifests = buildReleaseManifest(packagesToPublish);
  logger.info('Release manifests:');
  logger.info(
    releaseManifests
      .map(manifest => `${manifest.project.packageName}@${manifest.version}`)
      .join(', '),
    false,
  );

  await releasePackages(releaseManifests, { commit, dryRun, registry });
  logger.success('All packages published successfully!');
  logger.success(
    releaseManifests
      .map(manifest => `- ${manifest.project.packageName}@${manifest.version}`)
      .join('\n'),
    false,
  );
}
