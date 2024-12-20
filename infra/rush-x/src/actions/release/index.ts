import { type Command } from 'commander';
import { logger } from '@coze-infra/rush-logger';

import { type InstallAction } from '../../types';
import { type ReleaseOptions } from './types';
import { release } from './action';

export const installAction: InstallAction = (program: Command) => {
  program
    .command('release')
    .description('Release packages based on git tags.')
    .requiredOption('--commit <string>', '需要执行发布的 commit id')
    .option('--dry-run', '是否只执行不真实发布', false)
    .option('-r, --registry <string>', '发布到的 registry')
    .action(async (options: ReleaseOptions) => {
      try {
        if (!options.commit) {
          throw new Error('请提供需要发布的 commit id');
        }
        if (!process.env.NODE_AUTH_TOKEN) {
          throw new Error('请设置 NODE_AUTH_TOKEN 环境变量');
        }
        await release(options);
      } catch (error) {
        logger.error('Release failed!');
        logger.error((error as Error).message);
        process.exit(1);
      }
    });
};
