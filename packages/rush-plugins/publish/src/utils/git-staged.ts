import { exec } from './exec';

const serializeFilesName = (output: string): string[] =>
  output
    .split('\n')
    .map(line => {
      if (line) {
        const trimmedLine = line.trim();
        return trimmedLine;
      }
      return '';
    })
    .filter(line => line && line.length > 0);

export const getChangedFilesFromCached = async (): Promise<string[]> => {
  const output = await exec('git diff --name-only --diff-filter=ACMR --cached');
  if (!output) {
    return [];
  }
  return serializeFilesName(output.stdout);
};
