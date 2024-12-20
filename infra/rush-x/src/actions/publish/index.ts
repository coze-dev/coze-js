import { type Command } from 'commander';
import { logger } from '@coze-infra/rush-logger';

import { type InstallAction } from '../../types';
import { type PublishOptions } from './types';
import { publish } from './action';

export const installAction: InstallAction = (program: Command) => {
  program
    .command('publish')
    .description('Generate new version and create release branch.')
    .option('-v, --version <string>', '指定发布版本号')
    .option('-d, --dry-run', '是否为测试运行模式', false)
    .option('-t, --to <packages...>', '发布指定包及其下游依赖')
    .option('-f, --from <packages...>', '发布指定包及其上下游依赖')
    .option('-o, --only <packages...>', '仅发布指定包')
    .option('-s, --skip-commit', '是否跳过提交', false)
    .option('-p, --skip-push', '是否跳过推送', false)
    .option(
      '-b, --bump-type <type>',
      '版本升级类型 (alpha/beta/patch/minor/major)',
      /^(alpha|beta|patch|minor|major)$/,
    )
    .action(async (options: PublishOptions) => {
      try {
        await publish(options);
      } catch (error) {
        logger.error('Publish failed!');
        logger.error((error as Error).message);
      }
    });
};
