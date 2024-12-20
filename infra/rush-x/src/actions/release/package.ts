import path from 'path';

import {
  DependencyType,
  type RushConfigurationProject,
} from '@rushstack/rush-sdk';
import { readJsonFile, writeJsonFile } from '@coze-infra/fs-enhance';

import { getRushConfiguration } from '../../utils/project-analyzer';

/**
 * 更新依赖版本
 */
export const updateDependencyVersions = async (
  project: RushConfigurationProject,
): Promise<void> => {
  const rushConfiguration = getRushConfiguration();
  const { dependencies } = project.packageJson;
  for (const [dep, ver] of Object.entries(dependencies)) {
    if (/^workspace:/.test(ver) && rushConfiguration.getProjectByName(dep)) {
      project.packageJsonEditor.addOrUpdateDependency(
        dep,
        ver,
        DependencyType.Regular,
      );
    }
  }
  await project.packageJsonEditor.saveIfModified();
};

export const applyCozePublishConfig = async (
  project: RushConfigurationProject,
) => {
  const packageJsonPath = path.join(project.projectFolder, 'package.json');
  const packageJson = await readJsonFile<
    Record<string, unknown> & { cozePublishConfig?: Record<string, unknown> }
  >(packageJsonPath);
  const { cozePublishConfig } = packageJson;
  if (cozePublishConfig) {
    const keys = Object.keys(cozePublishConfig);
    for (const key of keys) {
      packageJson[key] = cozePublishConfig[key];
    }
    await writeJsonFile(packageJsonPath, packageJson);
  }
};
