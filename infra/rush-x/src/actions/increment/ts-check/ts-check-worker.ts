import path from 'path';
import { parentPort, isMainThread } from 'node:worker_threads';

import { getPreEmitDiagnostics, type Diagnostic } from 'typescript';
import { logger } from '@coze-infra/rush-logger';

import { createTsProgram, formatTsDiagnostics } from '../../../utils/ts-helper';
import { resolveTsconfigFile } from './resolve-tsconfig-file';
import { resolveTsconfig } from './resolve-tsconfig';

export interface DiagnosticInfo {
  filename?: string;
  message: string;
  error: string;
  line?: number;
}

export interface WorkerResult {
  type: 'finish' | 'error';
  payload: DiagnosticInfo[] | Error;
}

const formatDiagnostics = (
  diagnostics: Diagnostic[],
  rootFolder: string,
): DiagnosticInfo[] =>
  diagnostics.map(item => {
    const fileName = item.file?.fileName;
    const message =
      typeof item.messageText === 'string'
        ? item.messageText
        : item.messageText.messageText;
    const issue = {
      message,
      error: formatTsDiagnostics([item], rootFolder),
    };
    if (fileName) {
      const relativeFilename = path.relative(rootFolder, fileName);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const lineNo = item
        .file!.text.substring(0, item.start)
        .split('\n').length;
      Object.assign(issue, {
        filename: relativeFilename,
        line: lineNo,
      });
    }
    return issue;
  });

export const checkPackage = async (context: {
  projectFolder: string;
  rootFolder: string;
  packageName: string;
  changedFiles: string[];
}): Promise<DiagnosticInfo[]> => {
  const { projectFolder, rootFolder, packageName } = context;
  const printLog = (msg: string, type: 'info' | 'error' = 'info') => {
    const prefix = `[${packageName}] `;
    logger[type](`${prefix} ${msg}`);
  };

  let tsconfigFile = '';
  try {
    // 某些项目可能没有 tsconfig 文件
    // 这里直接跳过
    tsconfigFile = await resolveTsconfigFile(projectFolder);
  } catch (e) {
    printLog((e as Error).message, 'error');
    throw e;
  }

  const fullConfig = await resolveTsconfig(tsconfigFile, projectFolder);

  printLog(
    `- Start to check type of "${path.relative(
      rootFolder,
      projectFolder,
    )}" with config file: "${path.basename(tsconfigFile)}";`,
  );
  const program = createTsProgram(fullConfig, projectFolder);
  const start = performance.now();
  const diagnostics = getPreEmitDiagnostics(program);
  const duration = Math.ceil(performance.now() - start);
  printLog(
    `- Finish to check ${path.relative(
      rootFolder,
      projectFolder,
    )} in ${duration}ms.`,
  );
  // error TS2307:  Cannot find module 'xxx' or its corresponding type declarations
  // 用于支持依赖产物的增量检测效果
  // const TS_ERROR_2307 = 2307;
  // const matchedDiagnostics = diagnostics
  //   .filter(r => !r.file || changedFiles.includes(r.file.fileName))
  //   .filter(r => r.code !== TS_ERROR_2307);
  const matchedDiagnostics = [...diagnostics];
  return [
    ...(fullConfig.errors.length > 0
      ? formatDiagnostics(fullConfig.errors, rootFolder)
      : []),
    ...formatDiagnostics(matchedDiagnostics, rootFolder),
  ];
};

function main() {
  if (isMainThread && process.env.NODE_ENV !== 'test') {
    throw new Error('Do not invoke this file in main thread.');
  }

  parentPort.on('message', async data => {
    try {
      const res = await checkPackage(data);
      parentPort.postMessage({ type: 'finish', payload: res });
    } catch (e) {
      parentPort.postMessage({ type: 'error', payload: e });
    }
  });
}
main();
