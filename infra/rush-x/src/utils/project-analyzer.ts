import { type RushConfigurationProject } from '@rushstack/rush-sdk/lib/api/RushConfigurationProject';
import { RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration';
import { logger } from '@coze-infra/rush-logger';

import { setOutput } from './ci-interactor';

export const getRushConfiguration = (() => {
  let rushConfiguration: RushConfiguration | null = null;
  return (useCache = true) => {
    if (!useCache) {
      rushConfiguration = null;
    }
    return (rushConfiguration ||= RushConfiguration.loadFromDefaultLocation({
      startingFolder: process.cwd(),
    }));
  };
})();

export function printUpdatedPackages(packages: unknown[]): void {
  packages.forEach(p => {
    const { name, oldVersion, newVersion } = p as {
      name: string;
      oldVersion: string;
      newVersion: string;
    };
    const beforeUpdatePackage = `${name}@${oldVersion}`;
    const afterUpdatePackage = `${name}@${newVersion}`;
    setOutput(name, newVersion);
    logger.info(`${beforeUpdatePackage}  ==>  ${afterUpdatePackage}`);
  });
}

export function getChangedFilesFromRemote(files: string): string[] {
  const params = files.slice(1, -1);
  return params ? params.split(',') : [];
}

// { [package name]: [files] }
export const groupChangedFilesByProject = (
  changedFiles: string[],
): Record<string, string[]> => {
  const rushConfiguration: RushConfiguration = getRushConfiguration();
  const changedProjects: Record<string, string[]> = {};
  const lookup = rushConfiguration.getProjectLookupForRoot(
    rushConfiguration.rushJsonFolder,
  );

  for (const file of changedFiles) {
    const project = lookup.findChildPath(file);
    if (project) {
      changedProjects[project.packageName] =
        changedProjects[project.packageName] || [];
      const group = changedProjects[project.packageName];
      group.push(file);
    }
  }
  return changedProjects;
};

//  TODO: deprecated, 后面应该可以收敛这个函数
export function getChangedProjectsFromRemote(
  files: string | string[],
): RushConfigurationProject[] {
  const rushConfiguration: RushConfiguration = getRushConfiguration();
  const changedFiles =
    typeof files === 'string' ? getChangedFilesFromRemote(files) : files;
  const changedProjects: Set<RushConfigurationProject> = new Set();
  const lookup = rushConfiguration.getProjectLookupForRoot(
    rushConfiguration.rushJsonFolder,
  );

  for (const file of changedFiles) {
    const project = lookup.findChildPath(file);
    if (project) {
      if (!changedProjects.has(project)) {
        changedProjects.add(project);
      }
    }
  }
  return [...changedProjects];
}

export function getChangedProjectsNameByTag(tags: string[]): string[] {
  const rushConfiguration: RushConfiguration = getRushConfiguration();
  const { projectsByTag } = rushConfiguration;

  const projectsNameByTag: string[] = [];
  for (const tag of tags) {
    const projects = projectsByTag.get(tag);
    if (projects?.size) {
      for (const project of projects.values()) {
        projectsNameByTag.push(project.packageName);
      }
    }
  }
  return projectsNameByTag;
}

export function getAllConsumePackages(packages: string[]): string[] {
  const rushConfiguration: RushConfiguration = getRushConfiguration();
  const { projectsByName } = rushConfiguration;
  const consumePackages: string[] = [];

  for (const packageName of packages) {
    const project = projectsByName.get(packageName);
    if (project) {
      const itemConsumePackages = [...project.consumingProjects]
        .filter(p => p.shouldPublish)
        .map(p => p.packageName);

      if (itemConsumePackages.length) {
        const subConsumePackages = getAllConsumePackages(itemConsumePackages);
        consumePackages.push(...itemConsumePackages);
        consumePackages.push(...subConsumePackages);
      }
    }
  }
  return [...new Set(consumePackages)];
}
