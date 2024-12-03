import path from 'path';

import { glob } from 'fast-glob';

import { type AuditDetectResult, type AuditRule } from '../types';

const defaultEssentialFiles = [
  'eslint.config.{cjs,mjs,js,ts,mts,cts}',
  'tsconfig.json',
  // 'OWNERS'
];

export const checkEssentialConfigFiles: AuditRule<{
  essentialFiles?: string[];
}> = {
  name: 'essential-config-file',
  async fn(project, config?) {
    const { projectFolder } = project;
    const essentialFiles = config?.essentialFiles || defaultEssentialFiles;
    return (
      await Promise.all(
        essentialFiles.map(
          async (file: string): Promise<AuditDetectResult | undefined> => {
            const files = await glob(file, {
              cwd: projectFolder,
            });

            if (!files.length) {
              return {
                content: `\`${path.basename(
                  file,
                )}\` does not exist, please add it to your package.`,
              };
            }
          },
        ),
      )
    ).filter(r => !!r);
  },
};
