import path from 'path';

import { isFileExists, readJsonFile } from '@coze-infra/fs-enhance';

import { type RuleConfigTuple, RuleReportLevel } from '../types';
import { presetRules } from '../rules';

const normalizeRuleTuple = (rule: RuleConfigTuple) => {
  if (!Array.isArray(rule)) {
    return undefined;
  }
  const [name, level, extractConfig] = rule;
  if (presetRules.findIndex(r => r.name === name) < 0) {
    throw new Error(`Cannot find rule for ${name}`);
  }
  const allowedLevels = Object.values(RuleReportLevel);
  const normalizeLevel = allowedLevels.includes(level)
    ? level
    : RuleReportLevel.ERROR;
  return [name, normalizeLevel, extractConfig || {}] as RuleConfigTuple;
};

interface AuditEngineConfig {
  enable: boolean;
  rules?: RuleConfigTuple[];
}

export const readConfig = async (
  folder: string,
): Promise<AuditEngineConfig | undefined> => {
  const configFile = path.resolve(folder, './config/rushx-config.json');
  if (!(await isFileExists(configFile))) {
    return { enable: true };
  }
  try {
    const config = await readJsonFile<{ packageAudit?: AuditEngineConfig }>(
      configFile,
    );
    const { enable, rules } = config?.packageAudit || {};
    return {
      enable: typeof enable === 'boolean' ? enable : true,
      rules: !rules
        ? undefined
        : rules.map(r => normalizeRuleTuple(r)).filter(r => !!r),
    };
  } catch (e) {
    throw new Error(
      `Can not read config from "${configFile}":\n ${(e as Error).message}`,
    );
  }
};
