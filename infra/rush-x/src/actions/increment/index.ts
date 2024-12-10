import { type Command } from 'commander';
import { JsonFile } from '@rushstack/node-core-library';
import { logger } from '@coze-infra/rush-logger';

import { type InstallAction } from '../../types';
import { extractChangedFilesByGitDiff } from './helper';
import { incrementlyRunCommands } from './action';

interface IncrementOptions {
  branch?: string;
  changedPath?: string;
  changedFiles?: string;
  separator: string;
  action?: string;
}
export const installAction: InstallAction = (program: Command) => {
  program
    .command('increment')
    .description('Increment run your scripts')
    .option('-f, --changed-files <files>', 'List of changed files')
    .option(
      '-s, --separator <char>',
      'Separator for the list of changed files',
      ',',
    )
    .option(
      '-p, --changed-path <path>',
      'File path containing the list of changed files',
    )
    .option(
      '-b, --branch <branch>',
      'Target branch for comparison. Before using this parameter, it is recommended to execute `git fetch` first',
    )
    .option(
      '--action <action>',
      'Supported incremental operation commands. eg: build, test:cov, lint, ts-check, style, package-audit',
    )
    .action((options: IncrementOptions) => {
      let changedFiles: string[];

      if (options.branch) {
        changedFiles = extractChangedFilesByGitDiff(options.branch);
      } else if (options.changedPath) {
        changedFiles = JsonFile.load(options.changedPath) as string[];
      } else if (options.changedFiles) {
        changedFiles = options.changedFiles.split(options.separator);
      } else {
        logger.error('Nothing changes.');
        process.exit(1);
      }

      if (!options.action) {
        logger.error('Action is required');
        process.exit(1);
      }

      incrementlyRunCommands(changedFiles, options.action);
    });
};
