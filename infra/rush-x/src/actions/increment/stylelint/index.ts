import path from 'path';

import { getRushConfiguration } from '../../../utils/project-analyzer';
import { logger } from '../../../utils/logger';
import { runLintInProject } from './stylelint';
import { report } from './report';

// Only need to check these two types of files
const ALLOW_EXTS = ['.less', '.css'];

export const runStylelint = async (
  changedFileGroup: Record<string, string[]>,
): Promise<void> => {
  const rushConfiguration = getRushConfiguration();
  const projects = Object.keys(changedFileGroup);
  logger.info(
    `Try run stylelint at ${
      projects.length
    } projects, and covers ${projects.reduce(
      (acc, p) => acc + changedFileGroup[p].length,
      0,
    )} files.`,
  );
  const results = (
    await Promise.all(
      projects.map(async packageName => {
        const project = rushConfiguration.getProjectByName(packageName);
        const { projectRelativeFolder, projectFolder } = project;
        const files = changedFileGroup[packageName]
          .filter(r => ALLOW_EXTS.findIndex(e => r.endsWith(e)) >= 0)
          .map(r => path.relative(projectRelativeFolder, r));
        if (files.length <= 0) {
          return undefined;
        }
        const errors = await runLintInProject({
          cwd: projectFolder,
          files,
        });
        logger.info(
          `Finish run at ${packageName} with ${errors.length} errors.`,
        );
        return { packageName, errors, files, projectFolder };
      }),
    )
  )
    .filter(Boolean)
    .flat();
  await report(results, 'Stylelint Detect Report');
};
