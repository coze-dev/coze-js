import type { RushConfigurationProject } from '@rushstack/rush-sdk/lib/api/RushConfigurationProject';

import { readConfig } from './utils/read-config';
import { type RuleReport } from './types';
import { AuditEngine } from './engine';

export const auditPackage = async (project: RushConfigurationProject) => {
  const { projectFolder } = project;
  const config = await readConfig(projectFolder);
  const engine = new AuditEngine({
    ...config,
    project,
  });
  const result = await engine.run();
  return result;
};

export type AuditPackageReports = RuleReport[];
