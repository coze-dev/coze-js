import path from 'path';

import { isFileExists } from '@coze-infra/fs-enhance';

export const resolveTsconfigFile = async (
  projectFolder: string,
): Promise<string> => {
  const candidates = [
    'tsconfig.check.json',
    'tsconfig.build.json',
    'tsconfig.json',
  ];
  for (const candidate of candidates) {
    const configFile = path.join(projectFolder, candidate);

    if (await isFileExists(configFile)) {
      return configFile;
    }
  }
  throw new Error(
    `"${projectFolder}" has not any valid tsconfig file, please specify your ts config using one of: ${candidates
      .map(r => `\`${r}\``)
      .join(',')}`,
  );
};
