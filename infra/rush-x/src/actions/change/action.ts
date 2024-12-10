import path from 'path';
import fs from 'fs/promises';

import { type RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration';
import { logger } from '@coze-infra/rush-logger';

import { getRushConfiguration } from '../../utils/project-analyzer';
import { type ChangeOptions } from './types';
import { generateAllChangesFile, analysisCommitMsg } from './helper';
import { amendCommit } from './amend-commit';

export const generateChangeFiles = async (options: ChangeOptions) => {
  // CI 环境的提交不做处理
  if (options.ci || process.env.CI === 'true') {
    return;
  }
  if (options.amendCommit) {
    amendCommit();
    return;
  }
  try {
    let { commitMsg } = options;
    if (!commitMsg) {
      const rushConfiguration: RushConfiguration = getRushConfiguration();
      commitMsg = await fs.readFile(
        path.resolve(rushConfiguration.rushJsonFolder, '.git/COMMIT_EDITMSG'),
        'utf-8',
      );
    }

    const { content, type } = await analysisCommitMsg(commitMsg);
    if (!content) {
      logger.warning('Invalid subject');
      return;
    }
    generateAllChangesFile(content, type);
  } catch (e) {
    logger.error(`Generate changes file fail \n ${e}`);
  }
};
