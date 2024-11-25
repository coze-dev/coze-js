import { logger } from '@coze-infra/rush-logger';

import { stopProcess } from '../helper';
import { isCI } from '../../../utils/env';
import {
  addReport,
  CIReportConclusion,
  addIssue,
} from '../../../utils/ci-interactor';
import { type WorkerResult, type DiagnosticInfo } from './ts-check-worker';

const formatIssues = (issues: WorkerResult['payload']) => {
  if (Array.isArray(issues)) {
    (issues as DiagnosticInfo[]).forEach(issue => {
      const { filename, line, message } = issue;
      addIssue({
        rule: 'TS Type Check',
        severity: 'error' as const,
        message: message as string,
        path: filename,
        line,
      });
    });
    return `Failure With **${issues.length}** Issue(s):

\`\`\`bash
${issues.map(r => r.error).join('\n')}
\`\`\``;
  }

  const error = issues as Error;
  addIssue({
    rule: 'TS Type Check',
    severity: 'error' as const,
    message: error.message,
  });
  return `Failure with \`tsc\` command:

\`\`\`bash
${error.message}
\`\`\``;
};

// export for testing, it is not a good idea.
export const reportError = async (
  checkResult: { packageName: string; diagnostics: WorkerResult['payload'] }[],
  rootFolder: string,
): Promise<void> => {
  const reportName = 'Typescript check';
  const errorCount = checkResult.reduce(
    (r, d) => r + (Array.isArray(d.diagnostics) ? d.diagnostics.length : 1),
    0,
  );
  const reportToCi = async () => {
    const content = checkResult
      .map(
        ({ packageName, diagnostics }) => `## ${packageName}

${formatIssues(diagnostics)}
    `,
      )
      .join('\n');
    const localHelperTips = process.env.targetBranch
      ? `You can retry this with such command locally:

\`\`\` bash
git fetch
rush increment -a ts-check -b origin/${process.env.targetBranch}
\`\`\``
      : '';

    await addReport({
      name: reportName,
      conclusion: CIReportConclusion.FAILED,
      output: {
        summary: `Typescript Check Failure With **${errorCount}** Issue(s):

${localHelperTips}

${content}
`,
      },
    });
  };
  const reportToConsole = () => {
    checkResult.forEach(({ packageName, diagnostics }) => {
      const prefix = new Array('[ERROR] '.length).fill(' ').join('');
      logger.error(`${packageName}:`);
      logger.error(
        (Array.isArray(diagnostics)
          ? diagnostics.map(r => r.error).join('\n')
          : diagnostics.message
        )
          .split('\n')
          .map(r => `${prefix}${r}`)
          .join('\n'),
        false,
      );
    });
  };

  const shouldCIReport = isCI() || process.env.NODE_ENV === 'development';

  if (errorCount > 0) {
    logger.error(`😈 ${errorCount} issue(s) should be resolved.`);
    if (shouldCIReport) {
      await reportToCi();
    } else {
      await reportToConsole();
    }
    return;
  }

  if (shouldCIReport) {
    await addReport({
      name: reportName,
      conclusion: CIReportConclusion.SUCCESS,
      output: {
        summary: 'GOOD',
        description: '',
      },
    });
  }

  stopProcess(0);
};
