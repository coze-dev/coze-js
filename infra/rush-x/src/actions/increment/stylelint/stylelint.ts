import path from 'path';

import stylelint from 'stylelint';
import { isFileExists } from '@coze-infra/fs-enhance';

import { logger } from '../../../utils/logger';

export const runLintInProject = async (params: {
  cwd: string;
  files: string[];
}): Promise<stylelint.LintResult[]> => {
  const { cwd, files } = params;
  const configFile = path.resolve(cwd, '.stylelintrc.js');
  if (!(await isFileExists(configFile))) {
    return [];
  }
  logger.info(`Start run stylelint at ${cwd}`);
  const lastConfig = await stylelint.resolveConfig(configFile);

  lastConfig.allowEmptyInput = true;

  const { results } = await stylelint.lint({
    config: lastConfig,
    cwd,
    files,
    fix: false,
    quiet: true,
  });
  const errors = results.filter(r => r.warnings.length > 0);

  if (errors.length > 0) {
    const totalError = errors.reduce((acc, r) => acc + r.warnings.length, 0);
    logger.error(`Got ${totalError}'s errors at this run.`);
  }

  return errors;
};
