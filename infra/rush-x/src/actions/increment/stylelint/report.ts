import { type LintResult } from 'stylelint';

import { stopProcess } from '../helper';
import { isCI } from '../../../utils/env';
import { addReport, CIReportConclusion } from '../../../utils/ci-interactor';

const formatError = (error: LintResult) => {
  const { source, warnings } = error;
  const content = warnings.map(
    r => `[${r.line}:${r.column}] ${r.severity} ${r.text} (${r.rule})`,
  );
  return `${source}\n${content}`;
};

export const report = async (
  results: {
    errors: LintResult[];
    files: string[];
    projectFolder: string;
    packageName: string;
  }[],
  reportName: string,
) => {
  const fatalPackages = results.filter(r => r.errors.length > 0);
  if (fatalPackages.length <= 0) {
    if (isCI() || process.env.NODE_ENV === 'development') {
      await addReport({
        name: reportName,
        conclusion: CIReportConclusion.SUCCESS,
        output: {
          summary: 'GOOD',
          description: '',
        },
      });
    }
    return;
  }
  const ciReportContent = fatalPackages
    .map(
      r => `## ${r.packageName}

\`\`\` bash
${r.errors.map(formatError).join('\n\n')}
\`\`\`
  `,
    )
    .join('\n');

  const localHelperTips = process.env.targetBranch
    ? `You can retry this with such command locally:

\`\`\` bash
git fetch
rush increment -a style -b origin/${process.env.targetBranch}
\`\`\``
    : '';

  await addReport({
    name: reportName,
    conclusion: CIReportConclusion.FAILED,
    output: {
      summary: `# Stylelint Detect Result

${localHelperTips}

${ciReportContent}
      `,
    },
  });

  stopProcess(1);
  // throw new Error(`Run Lint Failure`);
};
