import { type Command } from 'commander';

import { type InstallAction } from '../../types';
import { type ChangeOptions } from './types';
import { generateChangeFiles } from './action';

export const installAction: InstallAction = (program: Command) => {
  program
    .command('change')
    .description('Generate changes in a simple way.')
    .option(
      '-c, --commit-msg <commit-msg>',
      '本次提交信息,默认读取 .git/COMMIT_EDITMSG',
    )
    .option('-a, --amend-commit <boolean>', '是否 amend commit 阶段')
    .option('-i, --ci <boolean>', '是否在 CI 环境')
    .action((options: ChangeOptions) => {
      generateChangeFiles(options);
    });
};
