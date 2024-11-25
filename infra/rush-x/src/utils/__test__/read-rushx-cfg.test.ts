import { isFileExists, readJsonFile } from '@/fs-enhance';

import { getAllRushProjectConfigs, getProjectCfg } from '../read-rushx-cfg';
import { getRushConfiguration } from '../project-analyzer';

vi.mock('@/fs-enhance', () => ({
  isFileExists: vi.fn(),
  readJsonFile: vi.fn(),
}));

vi.mock('../project-analyzer', () => ({
  getRushConfiguration: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getProjectCfg', () => {
  it('should return defaultCfg', async () => {
    vi.mocked(isFileExists).mockResolvedValueOnce(false);
    const result = await getProjectCfg('projectFolder', {});
    expect(result).toEqual({});
  });

  it('should return readCfg', async () => {
    vi.mocked(isFileExists).mockResolvedValueOnce(true);
    vi.mocked(readJsonFile).mockResolvedValueOnce({ foo: 'bar' });
    const result = await getProjectCfg('projectFolder', { foo: 'bar' });
    expect(result).toEqual({ foo: 'bar' });
  });
});

describe('getAllRushProjectConfigs', () => {
  it('should return default config', async () => {
    vi.mocked(getRushConfiguration).mockReturnValueOnce({
      projects: [{ projectFolder: 'someProjectFolder' }],
    } as any);
    const result = await getAllRushProjectConfigs({ default: 'config' });
    expect(result).toEqual([
      {
        config: { default: 'config' },
        project: { projectFolder: 'someProjectFolder' },
      },
    ]);
  });

  it('should return params default config', async () => {
    vi.mocked(getRushConfiguration).mockReturnValueOnce({
      projects: [{ projectFolder: 'someProjectFolder' }],
    } as any);
    const result = await getAllRushProjectConfigs({ foo: 'bar' });
    expect(result).toEqual([
      {
        config: {
          foo: 'bar',
        },
        project: {
          projectFolder: 'someProjectFolder',
        },
      },
    ]);
  });
});
