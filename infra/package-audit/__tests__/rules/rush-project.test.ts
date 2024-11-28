import { type Mock } from 'vitest';
import { isFileExists, readJsonFile } from '@coze-infra/fs-enhance';

import { checkRushProjectFile } from '../../src/rules/rush-project';

vi.mock('@coze-infra/fs-enhance');

describe('rule-rush-project', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Should success if script & project config both exits', async () => {
    (isFileExists as Mock).mockResolvedValueOnce(true);
    const mockProject = {
      projectFolder: '/path/to/project',
      packageJson: {
        scripts: { build: 'tsc -b', 'test:cov': 'test' },
      },
    };
    (readJsonFile as Mock).mockResolvedValue({
      operationSettings: [
        { operationName: 'build', outputFolderNames: ['dist'] },
        { operationName: 'test:cov', outputFolderNames: ['coverage'] },
      ],
    });

    const res = await checkRushProjectFile.fn(mockProject);
    expect(res.length).toBe(0);
  });

  // Accept cases where there is configuration but no command
  it('Should success if script dismiss', async () => {
    (isFileExists as Mock).mockResolvedValueOnce(true);
    const mockProject = {
      projectFolder: '/path/to/project',
      packageJson: {},
    };
    (readJsonFile as Mock).mockResolvedValue({
      operationSettings: [
        { operationName: 'build', outputFolderNames: ['dist'] },
        { operationName: 'test:cov', outputFolderNames: ['coverage'] },
      ],
    });

    const res = await checkRushProjectFile.fn(mockProject);
    expect(res.length).toBe(0);
  });

  it('Should skip if script contains "exit"', async () => {
    (isFileExists as Mock).mockResolvedValueOnce(false);
    const mockProject = {
      projectFolder: '/path/to/project',
      packageJson: {
        scripts: { build: 'exit 0', 'test:cov': 'exit' },
      },
    };

    const res = await checkRushProjectFile.fn(mockProject);
    expect(res.length).toBe(0);
    expect(readJsonFile).not.toBeCalled();
  });

  it('Should report if project config file missing', async () => {
    (isFileExists as Mock).mockResolvedValue(false);
    const mockProject = {
      projectFolder: '/path/to/project',
      packageJson: {
        scripts: { build: 'tsc -b', 'test:cov': 'test' },
      },
    };

    const res = await checkRushProjectFile.fn(mockProject);
    expect(res.length).toBe(1);
  });

  it('Should report if test cache config missing', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    const mockProject = {
      projectFolder: '/path/to/project',
      packageJson: {
        scripts: { build: 'tsc -b', 'test:cov': 'test' },
      },
    };
    (readJsonFile as Mock).mockResolvedValue({
      operationSettings: [
        { operationName: 'build', outputFolderNames: ['dist'] },
      ],
    });

    const res = await checkRushProjectFile.fn(mockProject);
    expect(res.length).toBe(1);
  });

  it('Should report if cache config missing', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    const mockProject = {
      projectFolder: '/path/to/project',
      packageJson: {
        scripts: { build: 'tsc -b', 'test:cov': 'test' },
      },
    };
    (readJsonFile as Mock).mockResolvedValue({
      operationSettings: [],
    });

    const res = await checkRushProjectFile.fn(mockProject);
    expect(res.length).toBe(2);
  });
});
