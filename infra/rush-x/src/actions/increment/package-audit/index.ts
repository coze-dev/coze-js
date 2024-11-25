import { auditPackage } from '@coze-infra/package-audit';

import { getRushConfiguration } from '../../../utils/project-analyzer';
import { report } from './report';

export const runPackageAudit = async (
  changedFileGroup: Record<string, string[]>,
) => {
  const rushConfiguration = getRushConfiguration();
  const packages = Object.keys(changedFileGroup);

  const diagnostics = (
    await Promise.all(
      packages.map(async packageName => {
        const project = rushConfiguration.getProjectByName(packageName);
        const res = await auditPackage(project);
        return res;
      }),
    )
  ).flat();
  // keep this for debugging
  // const diagnostics = (
  //   await Promise.all(rushConfiguration.projects.map(r => auditPackage(r)))
  // ).flat();

  await report(diagnostics);
};
