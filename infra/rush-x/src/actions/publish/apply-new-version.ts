import path from 'path';

import { type RushConfigurationProject } from '@rushstack/rush-sdk';
import { logger } from '@coze-infra/rush-logger';
import { readJsonFile, writeJsonFile } from '@coze-infra/fs-enhance';

import { type PublishManifest } from './version';

const updatePackageVersion = async (
  project: RushConfigurationProject,
  newVersion: string,
): Promise<string> => {
  const packageJsonPath = path.resolve(project.projectFolder, 'package.json');
  const packageJson = await readJsonFile<{ version: string }>(packageJsonPath);
  packageJson.version = newVersion;
  await writeJsonFile(packageJsonPath, packageJson);
  return packageJsonPath;
};

export const applyPublishManifest = async (
  manifests: PublishManifest[],
): Promise<string[]> => {
  const modifiedFiles: string[] = [];
  for (const manifest of manifests) {
    const { project, newVersion } = manifest;

    const modifiedFile = await updatePackageVersion(project, newVersion);
    modifiedFiles.push(modifiedFile);
  }
  logger.info(
    `Updated version for packages: ${manifests.map(m => m.project.packageName).join(', ')}`,
  );
  return modifiedFiles;
};
