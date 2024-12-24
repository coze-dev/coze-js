import { type Command } from 'commander';
import { logger } from '@coze-infra/rush-logger';

import { type InstallAction } from '../../types';
import { type PublishOptions } from './types';
import { publish } from './action';

export const installAction: InstallAction = (program: Command) => {
  program
    .command('publish')
    .description('Generate new version and create release branch.')
    .option('-v, --version <string>', 'Specify publish version')
    .option('-d, --dry-run', 'Enable dry run mode', false)
    .option(
      '-t, --to <packages...>',
      'Publish specified packages and their downstream dependencies',
    )
    .option(
      '-f, --from <packages...>',
      'Publish specified packages and their upstream/downstream dependencies',
    )
    .option('-o, --only <packages...>', 'Only publish specified packages')
    .option('-s, --skip-commit', 'Skip git commit', false)
    .option('-p, --skip-push', 'Skip git push', false)
    .option(
      '-b, --bump-type <type>',
      'Version bump type (alpha/beta/patch/minor/major)',
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
