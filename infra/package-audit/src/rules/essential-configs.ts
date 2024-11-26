import path from 'path';

import { isFileExists } from '@coze-infra/fs-enhance';

import { type AuditRule, type AuditDetectResult } from '../types';

const defaultEssentialFiles = ['eslint.config.js', 'tsconfig.json', 'OWNERS'];

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
            const filePath = path.resolve(projectFolder, file);
            const exists = await isFileExists(filePath);

            if (!exists) {
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
