import { logger as log } from '@coze-infra/rush-logger';
import { type AuditPackageReports } from '@coze-infra/package-audit';

import { stopProcess } from '../../increment/helper';
import { isCI } from '../../../utils/env';
import { CIReportConclusion, addReport } from '../../../utils/ci-interactor';

const TURN_ON_CI_CHECKPOINT = true;
const joinAsRow = (cells: string[]) =>
  `|${cells.map(r => ` ${r} `).join('|')}|`;

export const report = async (diagnostics: AuditPackageReports) => {
  const hasError = diagnostics.filter(r => r.level === 'error').length > 0;
  const hasWarning = diagnostics.filter(r => r.level === 'warning').length > 0;
  const reportToCi = async () => {
    const ciConclusion = hasError
      ? TURN_ON_CI_CHECKPOINT
        ? CIReportConclusion.FAILED
        : CIReportConclusion.WARNING
      : hasWarning
        ? CIReportConclusion.WARNING
        : CIReportConclusion.SUCCESS;
    const reportName = 'Package Audit Checker';
    const summary = [`# ❌ ${reportName}`];

    if (hasError || hasWarning) {
      const localHelperTips = process.env.targetBranch
        ? `You can retry this with such command locally:

\`\`\` bash
git fetch
rush increment --action package-audit -b origin/${process.env.targetBranch}
\`\`\`

----

Please fix these problems:

`
        : '';
      const headers = ['Level', 'packageName', 'rule', 'detail'];
      const table = [
        joinAsRow(headers),
        joinAsRow(headers.map(() => '----')),
        ...diagnostics.map(r =>
          joinAsRow([
            `**${r.level}**`,
            `\`${r.packageName}\``,
            r.rule,
            r.content,
          ]),
        ),
      ].join('\n');

      summary.push(localHelperTips, table);
    } else {
      summary.push('Every things looks fine.');
    }
    await addReport({
      name: reportName,
      conclusion: ciConclusion,
      output: {
        summary: summary.join('\n\n'),
      },
    });
  };

  const reportToConsole = () => {
    diagnostics.forEach(({ packageName, level, content, rule }) => {
      log[level](`[${packageName}]: ${content} -- ${rule}`);
    });
  };

  if (isCI() || process.env.NODE_ENV === 'development') {
    await reportToCi();
  } else {
    await reportToConsole();
  }

  stopProcess(hasError && TURN_ON_CI_CHECKPOINT ? 1 : 0);
};
