import { stopProcess } from '../helper';
import { isCI } from '../../../utils/env';
import { addReport, CIReportConclusion } from '../../../utils/ci-interactor';

// export for testing, it is not a good idea.
export const report = async (
  lintResult: { packageName: string; diagnostics: string; hasError: boolean }[],
): Promise<void> => {
  const fatalPackages = lintResult.filter(r => r.hasError);
  const reportName = 'ESLint Detect';
  if (fatalPackages.length <= 0) {
    if (isCI() || process.env.NODE_ENV === 'development') {
      await addReport({
        name: reportName,
        conclusion: CIReportConclusion.SUCCESS,
        output: {
          summary: '',
          description: '',
        },
      });
    }
    // do nothing
    return;
  }
  const ciReportContent = fatalPackages
    .map(
      r => `## ${r.packageName}

\`\`\` bash
${r.diagnostics}
\`\`\`
  `,
    )
    .join('\n');
  const localHelperTips = process.env.targetBranch
    ? `You can retry this with such command locally:

\`\`\` bash
git fetch
rush increment -a lint -b origin/${process.env.targetBranch}
\`\`\``
    : '';

  await addReport({
    name: reportName,
    conclusion: CIReportConclusion.FAILED,
    output: {
      summary: `# ❌ ${reportName}

${localHelperTips}

${ciReportContent}
      `,
    },
  });

  stopProcess(1);
  // throw new Error(`Run Lint Failure`);
};
