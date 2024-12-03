import path from 'path';

import type ts from 'typescript';

import { parseFullTSConfig } from '../../../utils/ts-helper';

export const resolveTsconfig = (
  configFile: string,
  projectFolder: string,
): ts.ParsedCommandLine => {
  const fullConfig = parseFullTSConfig(
    {
      extends: configFile,
    },
    projectFolder,
  );
  if (!fullConfig.options.composite) {
    fullConfig.options.incremental = true;
  }
  // assign default config
  fullConfig.options.outDir = fullConfig.options.outDir || './ts-check';

  fullConfig.options.tsBuildInfoFile =
    fullConfig.options.tsBuildInfoFile ||
    path.join(fullConfig.options.outDir, '.tsbuildinfo');
  fullConfig.options.noEmit = false;
  return fullConfig;
};
