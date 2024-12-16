import { exec } from 'shelljs';
import { logger } from '@coze-infra/rush-logger';

import { getRushConfiguration } from '../../../utils/project-analyzer';
import { reportRushLog } from './report-to-ci';

export const runCommonCommands = (packages: string[], action: string): void => {
  const rushConfiguration = getRushConfiguration();
  const prefix = '--from';
  const postfix = [];
  if (['test:cov', 'build', 'perf-defender'].includes(action)) {
    postfix.push('-v');
  }
  const args = [
    'common/scripts/install-run-rush',
    action,
    ...packages.map(name => [prefix, name]).flat(),
    ...postfix,
  ];

  const start = performance.now();
  const command = `node ${args.join(' ')}`;
  logger.info(`Start running: ${command}`);
  const res = exec(command, {
    cwd: rushConfiguration.rushJsonFolder,
    fatal: false,
  });
  logger[res.code === 0 ? 'info' : 'error'](
    `finish exec command with exit code: ${res.code}`,
  );
  process.exitCode = res.code;

  reportRushLog(res, { command, duration: performance.now() - start, action });
};
