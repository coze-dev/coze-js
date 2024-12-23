import { type RushConfigurationProject } from '@rushstack/rush-sdk';

import { getRushConfiguration } from '../../utils/project-analyzer';
import { type PublishOptions } from './types';

enum RetrivePattern {
  TO = 'to',
  FROM = 'from',
  ONLY = 'only',
}

const retrivePackages = (
  pattern: RetrivePattern,
  packages: string[],
): Set<RushConfigurationProject> => {
  const rushConfiguration = getRushConfiguration();
  const matchedPackages = new Set<RushConfigurationProject>();
  packages.forEach(pkg => {
    const project = rushConfiguration.getProjectByName(pkg);
    if (!project) {
      throw new Error(`Package "${pkg}" not found in rush configuration`);
    }
    if (!project.shouldPublish) {
      throw new Error(
        `Package "${pkg}" is not set to publish. if you want to publish it, please set the "shouldPublish" property to true in the \`rush.json\` file.`,
      );
    }
    const matched: RushConfigurationProject['dependencyProjects'][] = [];
    switch (pattern) {
      case 'to': {
        matched.push(project.dependencyProjects);
        break;
      }
      case 'from': {
        matched.push(project.consumingProjects);
        matched.push(project.dependencyProjects);
        break;
      }
      case 'only': {
        // do nothing
        break;
      }
      default: {
        throw new Error('Unexpected package selection state');
      }
    }

    for (const matchedSet of matched) {
      for (const p of matchedSet) {
        if (p.shouldPublish) {
          matchedPackages.add(p);
        }
      }
    }
    matchedPackages.add(project);
  });
  return matchedPackages;
};

export const validateAndGetPackages = (options: PublishOptions) => {
  const retrivePatterns = Object.values(RetrivePattern);
  if (retrivePatterns.every(pattern => (options[pattern]?.length || 0) <= 0)) {
    throw new Error('No packages to publish');
  }
  return retrivePatterns.reduce((acc, pattern) => {
    const packages = options[pattern];
    if (!packages || packages.length <= 0) {
      return acc;
    }
    const placeholders = retrivePackages(pattern as RetrivePattern, packages);
    return new Set([...acc, ...placeholders]);
  }, new Set<RushConfigurationProject>());
};
