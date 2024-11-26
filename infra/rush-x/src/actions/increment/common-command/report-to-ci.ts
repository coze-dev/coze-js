import type shell from 'shelljs';

import { stopProcess } from '../helper';
import { logger } from '../../../utils/logger';
import { isCI } from '../../../utils/env';
import { addReport, CIReportConclusion } from '../../../utils/ci-interactor';

interface RushErrors {
  totalOperation: number | string;
  successOperation: number | string;
  failureOperation: number | string;
  cachedOperation: number | string;
  failureLogs: [string, string][];
}

// eslint-disable-next-line max-lines-per-function
export const reportRushLog = (
  res: shell.ShellString,
  context: { command: string; duration: number; action: string },
): void => {
  const name = `Increment run ${context.action}`;
  const isSuccess = res.code === 0;
  if (isSuccess === true) {
    if (isCI()) {
      addReport({
        conclusion: CIReportConclusion.SUCCESS,
        name,
        output: { summary: '' },
      });
    }
    // do nothing
    return;
  }
  if (isCI() === false && process.env.NODE_ENV !== 'development') {
    // do nothing
    return;
  }
  // 替换掉所有颜色制表符
  // eslint-disable-next-line no-control-regex
  const rushLog = res.stdout.toString().replace(/\[\d+m/g, '');
  const extractErrors = (): RushErrors => {
    const totalOperation =
      /Selected\s?(\d+)\s?operations?/.exec(rushLog)?.[1] || 'unknown';
    const successOperation =
      /SUCCESS:\s?(\d+)\s?operations?/.exec(rushLog)?.[1] || 'unknown';
    const failureOperation =
      /=+\[\sFAILURE:\s?(\d+)\s?operations?/.exec(rushLog)?.[1] || 'unknown';
    const cachedOperation =
      /FROM CACHE:\s?(\d+)\s?operations?/.exec(rushLog)?.[1] || 'unknown';

    const allFailureOperations = [
      ...rushLog.matchAll(/-+\[\s+FAILURE:\s?([@\w\d\/\.\-_]+)\s+\]/g),
    ].map(r => r[1]);

    const rushLogLines = rushLog.split('\n') as string[];
    const extractPkgLog = (packageName: string): string => {
      const reg = new RegExp(
        `^=+\\[\\s+(${packageName.replace(/[\-\/]/g, r => `\\${r}`)})\\s+\\]=+`,
      );
      const startIndex = rushLogLines.findIndex((line: string) =>
        reg.test(line),
      );
      let endIndex = startIndex + 1;
      for (let i = endIndex; i < rushLogLines.length; i += 1) {
        const line = rushLogLines[i];
        if (/^=+\[(.+)\]=+/.test(line)) {
          endIndex = i;
          break;
        }
      }
      return rushLogLines.slice(startIndex, endIndex).join('\n');
    };

    const failureLogs = allFailureOperations.map(
      r => [r, extractPkgLog(r)] as [string, string],
      {},
    );
    return {
      totalOperation,
      successOperation,
      failureOperation,
      cachedOperation,
      failureLogs,
    };
  };
  const reportErrors = (errors: RushErrors) => {
    if (Number(errors.failureOperation) <= 0) {
      addReport({
        conclusion: CIReportConclusion.SUCCESS,
        name,
        output: { summary: '' },
      });
      return;
    }
    const reportText = [`# ❌ Rush ${name} failure`];
    reportText.push(
      ...errors.failureLogs.map(
        ([packageName, errorLog]) => `## \`${packageName}\` Report Error(s):

\`\`\`bash
${errorLog}
\`\`\`

You can test it with \`rush ${context.action} -t ${packageName}\` locally.

    `,
      ),
    );
    reportText.push(`## Summary

Run Command:

\`\`\`bash
${context.command}
\`\`\`

Finish in ${Math.ceil(context.duration)}ms, with (${
      errors.totalOperation
    }) operation, and **(${errors.successOperation})** success, **(${
      errors.failureOperation
    })** failure, and **(${errors.cachedOperation})** use cached build.`);

    addReport({
      conclusion: CIReportConclusion.FAILED,
      name,
      output: { summary: reportText.join('\n') },
    });
  };
  let errors;
  try {
    errors = extractErrors();
    reportErrors(errors);
    if (Number(errors.failureOperation) > 0) {
      stopProcess(1);
    }
  } catch (e) {
    logger.error(`Log analyze failure:
${(e as Error).message}`);
  }
};
