import { type RushConfigurationProject } from '@rushstack/rush-sdk';
import { logger } from '@coze-infra/rush-logger';

import { exec } from '../../utils/exec';
import { type ReleaseOptions, type ReleaseManifest } from './types';
import { updateDependencyVersions, applyCozePublishConfig } from './package';

/**
 * 发布包
 */
const publishPackage = async (
  project: RushConfigurationProject,
  releaseOptions: ReleaseOptions,
): Promise<void> => {
  const { dryRun, registry } = releaseOptions;
  const token = process.env.NODE_AUTH_TOKEN;
  const args = [`NODE_AUTH_TOKEN=${token}`, 'npm', 'publish'];
  if (dryRun) {
    args.push('--dry-run');
  }
  if (registry) {
    args.push(`--registry=${registry}`);
  }

  await exec(args.join(' '), {
    cwd: project.projectFolder,
  });
  const { version } = project.packageJson;

  logger.success(`- Published ${project.packageName}@${version}`);
};

const buildProject = async (project: RushConfigurationProject) => {
  const { projectFolder } = project;
  await exec('npm run build', {
    cwd: projectFolder,
  });
};

const releasePackage = async (
  releaseManifest: ReleaseManifest,
  releaseOptions: ReleaseOptions,
) => {
  const prepareReleaseTasks: ((
    project: RushConfigurationProject,
  ) => Promise<void>)[] = [
    buildProject,
    updateDependencyVersions,
    applyCozePublishConfig,
  ];
  const { project } = releaseManifest;
  const { packageName } = project;
  logger.info(`Preparing release for package: ${packageName}`);
  for (const task of prepareReleaseTasks) {
    await task(project);
  }
  await publishPackage(project, releaseOptions);
};

export const releasePackages = async (
  releaseManifests: ReleaseManifest[],
  releaseOptions: ReleaseOptions,
) => {
  await Promise.all(
    releaseManifests.map(async manifest => {
      await releasePackage(manifest, releaseOptions);
    }),
  );
};
