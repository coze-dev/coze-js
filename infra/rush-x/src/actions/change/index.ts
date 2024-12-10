import { type Command } from 'commander';

import { type InstallAction } from '../../types';
import { type ChangeOptions } from './types';
import { generateChangeFiles } from './action';

export const installAction: InstallAction = (program: Command) => {
  program
    .command('change')
    .description('Generate changes in a simple way.')
    .option(
      '-c, --commit-msg <string>',
      '本次提交信息,默认读取 .git/COMMIT_EDITMSG',
    )
    .option('-a, --amend-commit', '是否 amend commit 阶段')
    .option('-i, --ci', '是否在 CI 环境')
    .action(async (options: ChangeOptions) => {
      await generateChangeFiles({ ...options });
    });
};
