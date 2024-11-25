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
      description: '变更文件列表',
    });

    this.separator = this.defineStringParameter({
      argumentName: 'SEPARATOR',
      parameterLongName: '--separator',
      parameterShortName: '-s',
      description: '变更文件列表分隔符',
      defaultValue: ',',
    });

    this.action = this.defineChoiceParameter({
      parameterLongName: '--action',
      description: '支持的增量操作命令',
      alternatives: [
        'build',
        'coverage',
        'test:cov',
        'lint',
        'perf-defender',
        'ts-check',
        'style',
        'package-audit',
      ],
    });

    this.changedPath = this.defineStringParameter({
      argumentName: 'CHANGED_PATH',
      parameterLongName: '--changed-path',
      parameterShortName: '-p',
      description: '变更文件列表所在文件路径',
    });

    this.comparedBranch = this.defineStringParameter({
      argumentName: 'COMPARE_BRANCH',
      parameterLongName: '--branch',
      parameterShortName: '-b',
      description:
        '需要作对比的目标分支，使用该参数前建议先执行 `git fetch`，确保对比结果的正确性',
    });
  }
}
