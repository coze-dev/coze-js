import path from 'path';

import { isFileExists, readJsonFile } from '@coze-infra/fs-enhance';

import { type AuditDetectResult, type AuditRule } from '../types';

const isEmptyCmd = (cmd?: string) =>
  typeof cmd !== 'string' || cmd.length <= 0 || /\s?exit\s?/.test(cmd);

export const checkRushProjectFile: AuditRule<unknown> = {
  name: 'rule-project.json',
  async fn(project, config?) {
    const { projectFolder, packageJson } = project;
    const rushProjectFilePath = path.resolve(
      projectFolder,
      'config/rush-project.json',
    );
    const res: AuditDetectResult[] = [];
    const commands = ['test:cov', 'build'];
    if (commands.every(c => isEmptyCmd(packageJson.scripts?.[c]))) {
      return res;
    }
    // 有 build 或 test 命令，但没有 project config 文件
    else if (!(await isFileExists(rushProjectFilePath))) {
      res.push({
        content: 'should provide "config/rush-project.json" file.',
      });
    } else {
      // TODO: 这里要补充 readJsonFile 抛错的处理逻辑
      const projectConfig = await readJsonFile<{
        operationSettings: {
          operationName: string;
          outputFolderNames: string[];
        }[];
      }>(rushProjectFilePath);
      commands.forEach(c => {
        if (
          isEmptyCmd(packageJson.scripts?.[c]) === false &&
          projectConfig.operationSettings.findIndex(
            r => r.operationName === c,
          ) < 0
        ) {
          res.push({
            content: `should provide "${c}" cache config in config file.`,
          });
        }
      });
    }
    return res;
  },
};
