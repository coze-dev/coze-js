import {
  CommandLineAction,
  type CommandLineStringParameter,
  type CommandLineChoiceParameter,
} from '@rushstack/ts-command-line';
import { JsonFile } from '@rushstack/node-core-library';

import type { RushCICommandLine } from '../..';
import { extractChangedFilesByGitDiff } from './helper';
import { incrementAction } from './action';

export class IncrementAction extends CommandLineAction {
  private parser: RushCICommandLine;

  private changedFiles: CommandLineStringParameter;

  private changedPath: CommandLineStringParameter;

  private action: CommandLineChoiceParameter;

  private comparedBranch: CommandLineStringParameter;

  private separator: CommandLineStringParameter;

  constructor(parser: RushCICommandLine) {
    super({
      actionName: 'increment',
      summary: 'Increment run your scripts',
      documentation: 'Increment run your scripts.',
    });
    this.parser = parser;
  }

  protected onExecute(): Promise<void> {
    let changedFiles: string[];
    if (this.comparedBranch.value) {
      changedFiles = extractChangedFilesByGitDiff(this.comparedBranch.value);
    } else if (this.changedPath.value) {
      changedFiles = JsonFile.load(this.changedPath.value) as string[];
    } else if (this.changedFiles.value) {
      changedFiles = this.changedFiles.value.split(this.separator.value);
    } else {
      throw new Error('Nothing changes.');
    }

    incrementAction(changedFiles, this.action.value);
    return;
  }

  protected onDefineParameters(): void {
    this.changedFiles = this.defineStringParameter({
      argumentName: 'CHANGED_FILES',
      parameterLongName: '--changed-files',
      parameterShortName: '-f',
      description: 'List of changed files',
    });

    this.separator = this.defineStringParameter({
      argumentName: 'SEPARATOR',
      parameterLongName: '--separator',
      parameterShortName: '-s',
      description: 'Separator for the list of changed files',
      defaultValue: ',',
    });

    this.action = this.defineChoiceParameter({
      parameterLongName: '--action',
      description: 'Supported incremental operation commands',
      alternatives: [
        'build',
        'coverage',
        'test:cov',
        'lint',
        'ts-check',
        'style',
        'package-audit',
      ],
    });

    this.changedPath = this.defineStringParameter({
      argumentName: 'CHANGED_PATH',
      parameterLongName: '--changed-path',
      parameterShortName: '-p',
      description: 'File path containing the list of changed files',
    });

    this.comparedBranch = this.defineStringParameter({
      argumentName: 'COMPARE_BRANCH',
      parameterLongName: '--branch',
      parameterShortName: '-b',
      description:
        'Target branch for comparison. Before using this parameter, it is recommended to execute `git fetch` first to ensure the accuracy of the comparison results',
    });
  }
}
