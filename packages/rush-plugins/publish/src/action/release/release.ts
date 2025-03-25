import { type RushConfigurationProject } from '@rushstack/rush-sdk';

import { logger } from '../../utils/logger';
import { exec } from '../../utils/exec';
import { type ReleaseOptions, type ReleaseManifest } from './types';
import { applyPublishConfig } from './package';

/**
 * 发布包
 */
const publishPackage = async (
  project: RushConfigurationProject,
  releaseOptions: ReleaseOptions,
): Promise<void> => {
  const { dryRun, registry } = releaseOptions;
  const token = process.env.NODE_AUTH_TOKEN;
  const { version } = project.packageJson;
  const tag = version.includes('alpha')
    ? 'alpha'
    : version.includes('beta')
      ? 'beta'
      : 'latest';
  const args = [`NODE_AUTH_TOKEN=${token}`, 'npm', 'publish', `--tag ${tag}`];
  if (dryRun) {
    args.push('--dry-run');
  }
  if (registry) {
    args.push(`--registry=${registry}`);
  }

  await exec(args.join(' '), {
    cwd: project.projectFolder,
  });

  logger.success(`- Published ${project.packageName}@${version}`);
};

const releasePackage = async (
  releaseManifest: ReleaseManifest,
  releaseOptions: ReleaseOptions,
) => {
  const { project } = releaseManifest;
  const { packageName } = project;
  logger.info(`Preparing release for package: ${packageName}`);
  await applyPublishConfig(project);
  await publishPackage(project, releaseOptions);
};

const buildProjects = async (releaseManifests: ReleaseManifest[]) => {
  const packageNames = releaseManifests.map(
    manifest => manifest.project.packageName,
  );
  const buildCommands = `rush build ${packageNames.map(name => `--to ${name}`).join(' ')}`;
  await exec(buildCommands);
};

export const releasePackages = async (
  releaseManifests: ReleaseManifest[],
  releaseOptions: ReleaseOptions,
) => {
  await buildProjects(releaseManifests);
  await Promise.all(
    releaseManifests.map(async manifest => {
      await releasePackage(manifest, releaseOptions);
    }),
  );
};
