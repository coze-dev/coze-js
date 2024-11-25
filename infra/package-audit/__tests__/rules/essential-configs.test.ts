import { type Mock } from 'vitest';
import { isFileExists } from '@coze-infra/fs-enhance';

import { checkEssentialConfigFiles } from '../../src/rules/essential-configs';

vi.mock('@coze-infra/fs-enhance');

describe('checkEssentialConfigFiles', () => {
  it('Should check rules of lint file correctly', async () => {
    (isFileExists as Mock).mockResolvedValue(false);

    const res = await checkEssentialConfigFiles.fn({
      projectFolder: '/path/to/project',
      // use default config
    });
    expect(res.length).toBe(3);
    expect(
      ['eslint.config.js', 'tsconfig.json', 'OWNERS'].every(
        o => res.findIndex(r => r.content.startsWith(`\`${o}\``)) >= 0,
      ),
    ).toBe(true);
  });

  it('Should return empty if all files exits', async () => {
    (isFileExists as Mock).mockResolvedValue(true);

    const res = await checkEssentialConfigFiles.fn({
      projectFolder: '/path/to/project',
      // use default config
    });
    expect(res.length).toBe(0);
  });

  it('Should use config', async () => {
    (isFileExists as Mock).mockResolvedValue(false);

    const files = ['eslint.config.js', 'tsconfig.json'];
    const res = await checkEssentialConfigFiles.fn(
      {
        projectFolder: '/path/to/project',
      },
      { essentialFiles: files },
    );
    expect(res.length).toBe(files.length);
    expect(
      files.every(
        o => res.findIndex(r => r.content.startsWith(`\`${o}\``)) >= 0,
      ),
    ).toBe(true);
  });
});
