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
    // 没有提供 rules 配置项的场景
    (readJsonFile as Mock).mockResolvedValueOnce({
      packageAudit: {},
    });
    expect(await readConfig('/path/to/file')).toEqual({
      enable: true,
    });

    // 过滤 rules 数组中的空值
    (readJsonFile as Mock).mockResolvedValueOnce({
      packageAudit: {
        rules: [undefined],
      },
    });
    expect(await readConfig('/path/to/file')).toEqual({
      enable: true,
      rules: [],
    });

    // 没有配置 packageAudit 配置项的场景
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
