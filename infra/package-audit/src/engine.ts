import type { RushConfigurationProject } from '@rushstack/rush-sdk';

import {
  RuleReportLevel,
  type RuleReport,
  type RuleConfigTuple,
  type AuditReporter,
} from './types';
import { presetRules } from './rules';

interface AuditEngineConfig {
  /**
   * Whether to enable audit analysis
   */
  enable: boolean;
  /**
   * Rules to be checked
   */
  rules: RuleConfigTuple[];
  /**
   * Package name to be checked
   */
  project: RushConfigurationProject;
  /**
   * Formatting scheme, currently only supports text format
   */
  reporter: AuditReporter;
}
const noop = () => {
  // do nothing
};

const zip = <T extends Record<string, unknown>>(obj: T): Partial<T> =>
  Object.keys(obj).reduce((acc, k) => {
    const v = obj[k];
    if (
      // Empty object
      typeof v === 'undefined' ||
      // Empty array
      (Array.isArray(v) && v.length === 0)
    ) {
      return acc;
    }
    return { ...acc, [k]: v };
  }, {});

export class AuditEngine {
  private options: AuditEngineConfig;
  constructor(options: Partial<AuditEngineConfig>) {
    this.options = Object.assign(
      {
        reporter: noop,
        enable: true,
        rules: presetRules.map(r => [r.name, RuleReportLevel.ERROR]),
      },
      zip(options),
    ) as AuditEngineConfig;
    if (!this.options.project) {
      throw new Error('Should provide valid project definition.');
    }
  }

  async run() {
    const { enable, rules, project } = this.options;
    if (!enable) {
      return [];
    }
    const ruleFuncs = rules.map(([name, reportLevel, extractConfig]) => {
      const presetRule = presetRules.find(i => i.name === name);
      if (!presetRule) {
        throw new Error(
          `Can not find preset rule according to this name: ${name}`,
        );
      }
      return { ...presetRule, level: reportLevel, extractConfig };
    });
    const { packageName } = project;
    const res = (
      await Promise.all(
        ruleFuncs.map(async r => {
          const result = await r.fn(project, r.extractConfig);
          return result.map(d => ({
            ...d,
            level: r.level || RuleReportLevel.ERROR,
            rule: r.name,
            packageName,
          })) as RuleReport[];
        }),
      )
    ).flat();
    this.report(res);
    return res;
  }

  private report(reportRecords: RuleReport[]) {
    const { reporter } = this.options;
    reporter(reportRecords);
  }
}
