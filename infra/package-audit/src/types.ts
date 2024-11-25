import type { RushConfigurationProject } from '@rushstack/rush-sdk/lib/api/RushConfigurationProject';

export enum RuleReportLevel {
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

export type RuleConfigTuple = [
  string,
  RuleReportLevel,
  Record<string, unknown>?,
];

export interface RuleReport {
  content: string;
  level: RuleReportLevel;
  packageName: string;
  rule: string;
}

export type AuditDetectResult = Pick<RuleReport, 'content'>;
export interface AuditRule<T> {
  name: string;
  fn: (
    project: RushConfigurationProject,
    config?: T,
  ) => Promise<AuditDetectResult[]>;
}

export type AuditReporter = (records: RuleReport[]) => void;
