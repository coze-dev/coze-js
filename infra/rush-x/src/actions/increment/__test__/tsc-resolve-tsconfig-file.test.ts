import path from 'path';

import { isFileExists } from '@/fs-enhance';

import { resolveTsconfigFile } from '../ts-check/resolve-tsconfig-file';

vi.mock('@/fs-enhance', () => ({
  isFileExists: vi.fn(),
}));

describe('resolveTsconfigFile', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the first existing tsconfig file', async () => {
    const projectFolder = '/path/to/project';

    isFileExists.mockImplementation(file =>
      Promise.resolve(file === path.join(projectFolder, 'tsconfig.build.json')),
    );

    const result = await resolveTsconfigFile(projectFolder);

    expect(result).toBe(path.join(projectFolder, 'tsconfig.build.json'));
    expect(isFileExists).toHaveBeenCalledTimes(2);
    expect(isFileExists).toHaveBeenCalledWith(
      path.join(projectFolder, 'tsconfig.check.json'),
    );
    expect(isFileExists).toHaveBeenCalledWith(
      path.join(projectFolder, 'tsconfig.build.json'),
    );
    expect(isFileExists).not.toHaveBeenCalledWith(
      path.join(projectFolder, 'tsconfig.json'),
    );
  });

  it('should throw an error if no valid tsconfig file is found', async () => {
    const projectFolder = '/path/to/project';

    isFileExists.mockResolvedValue(false);

    await expect(resolveTsconfigFile(projectFolder)).rejects.toThrowError(
      `"${projectFolder}" has not any valid tsconfig file, please specify your ts config using one of: \`tsconfig.check.json\`,\`tsconfig.build.json\`,\`tsconfig.json\``,
    );

    expect(isFileExists).toHaveBeenCalledTimes(3);
    expect(isFileExists).toHaveBeenCalledWith(
      path.join(projectFolder, 'tsconfig.check.json'),
    );
    expect(isFileExists).toHaveBeenCalledWith(
      path.join(projectFolder, 'tsconfig.build.json'),
    );
    expect(isFileExists).toHaveBeenCalledWith(
      path.join(projectFolder, 'tsconfig.json'),
    );
  });
});
