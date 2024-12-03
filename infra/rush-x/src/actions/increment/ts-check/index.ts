import path from 'path';

import { logger } from '@coze-infra/rush-logger';

import { WorkerPool } from '../../../utils/worker-pool';
import { getRushConfiguration } from '../../../utils/project-analyzer';
import { type WorkerResult, type DiagnosticInfo } from './ts-check-worker';
import { reportError } from './report-error';
import BLACK_LIST from './blackList.json';

export const runTsCheck = async (
  changedFileGroup: Record<string, string[]>,
): Promise<void> => {
  process.exitCode = 0;
  const rushConfiguration = getRushConfiguration();
  const pool = await WorkerPool.createPool(
    path.resolve(__dirname, './worker.js'),
  );
  const rootFolder = rushConfiguration.rushJsonFolder;

  const packages = Object.keys(changedFileGroup);

  if (packages.length === 0) {
    logger.info('Nothing todo, pass.');
    return;
  }

  const matchedDiagnostics = (
    await Promise.all(
      packages
        .filter(r => BLACK_LIST.includes(r) === false)
        .map(async packageName => {
          const { projectFolder } =
            rushConfiguration.getProjectByName(packageName);
          const changedFiles = changedFileGroup[packageName].map(r =>
            path.join(rootFolder, r),
          );
          const diagnostics = (await pool.run({
            packageName,
            projectFolder,
            rootFolder,
            changedFiles,
          })) as WorkerResult['payload'];
          return {
            packageName,
            diagnostics,
          };
        }),
    )
  ).filter(
    r =>
      Array.isArray(r.diagnostics) === false ||
      (r.diagnostics as DiagnosticInfo[]).length > 0,
  );
  pool.stop();

  await reportError(matchedDiagnostics, rootFolder);
};
