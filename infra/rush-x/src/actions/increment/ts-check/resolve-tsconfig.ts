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
  // config/ts-config/tsconfig.base.json 文件指定了 increment
  // 但各个 package 下可能没有声明 tsBuildInfoFile 属性，可能导致报错
  fullConfig.options.tsBuildInfoFile =
    fullConfig.options.tsBuildInfoFile ||
    path.join(fullConfig.options.outDir, '.tsbuildinfo');
  fullConfig.options.noEmit = false;
  return fullConfig;
};
