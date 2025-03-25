import path from 'path';

import { type RushConfiguration } from '@rushstack/rush-sdk';

import { getChangedFilesFromCached } from '../../utils/git';
import { getRushConfiguration } from '../../utils/get-rush-config';
import { exec } from '../../utils/exec';

export const amendCommit = async (): Promise<void> => {
  const changedFiles = await getChangedFilesFromCached();
  const rushConfiguration: RushConfiguration = getRushConfiguration();

  const relativeChangesFolder = path.relative(
    rushConfiguration.rushJsonFolder,
    rushConfiguration.changesFolder,
  );

  for (const file of changedFiles) {
    if (file.startsWith(relativeChangesFolder)) {
      await exec('git commit --amend --no-edit -n');
      break;
    }
  }
};
