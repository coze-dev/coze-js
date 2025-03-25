import fs from 'fs/promises';

export const readJsonFile = async <T>(path: string) => {
  const content = await fs.readFile(path, 'utf8');
  return JSON.parse(content) as T;
};

export const writeJsonFile = async (path: string, data: unknown) => {
  await fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8');
};

export const isFileExists = async (path: string) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);

export const isDirExists = async (path: string) =>
  fs
    .access(path)
    .then(() => true)
    .catch(() => false);
