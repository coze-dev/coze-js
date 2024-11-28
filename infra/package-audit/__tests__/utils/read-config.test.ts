import { type Mock } from 'vitest';
import { isFileExists, readJsonFile } from '@coze-infra/fs-enhance';

import { readConfig } from '../../src/utils/read-config';

vi.mock('../../src/rules', () => ({
  presetRules: [{ name: 'foo' }, { name: 'bar' }],
}));
vi.mock('@coze-infra/fs-enhance');

describe('readConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should return config obj', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    const mockConfig = {
      enable: true,
      rules: [
        ['foo', 'error', { foo: 'bar' }],
        ['bar', 'error', { foo: 'bar' }],
      ],
    };
    (readJsonFile as Mock).mockResolvedValue({
      packageAudit: mockConfig,
    });

    const config = await readConfig('/path/to/file');
    expect(config).toEqual(mockConfig);
  });

  it('should throw error if rule name not match', () => {
    (isFileExists as Mock).mockResolvedValue(true);
    const mockConfig = {
      enable: true,
      rules: [['bad rule name', 'error', { foo: 'bar' }]],
    };
    (readJsonFile as Mock).mockResolvedValue({
      packageAudit: mockConfig,
    });

    expect(() => readConfig('/path/to/file')).rejects.toThrow();
  });

  it('should auto fix config problems', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    const mockConfig = {
      rules: [['foo', 'verbose'], ['bar']],
    };
    (readJsonFile as Mock).mockResolvedValue({
      packageAudit: mockConfig,
    });

    const config = await readConfig('/path/to/file');
    expect(config).toEqual({
      enable: true,
      rules: [
        ['foo', 'error', {}],
        ['bar', 'error', {}],
      ],
    });
  });

  it('should suit to empty rules', async () => {
    (isFileExists as Mock).mockResolvedValue(true);
    // Case: no rules config provided
    (readJsonFile as Mock).mockResolvedValueOnce({
      packageAudit: {},
    });
    expect(await readConfig('/path/to/file')).toEqual({
      enable: true,
    });

    // Filter empty values in rules array
    (readJsonFile as Mock).mockResolvedValueOnce({
      packageAudit: {
        rules: [undefined],
      },
    });
    expect(await readConfig('/path/to/file')).toEqual({
      enable: true,
      rules: [],
    });

    // Case: no packageAudit config provided
    (readJsonFile as Mock).mockResolvedValueOnce({});
    expect(await readConfig('/path/to/file')).toEqual({
      enable: true,
    });
  });

  it('should return empty if file not exists', async () => {
    (isFileExists as Mock).mockResolvedValue(false);
    expect(await readConfig('/path/to/file')).toEqual({
      enable: true,
    });
  });
});
