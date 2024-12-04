import { vi } from 'vitest';
import { glob } from 'fast-glob';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';

import { checkEssentialConfigFiles } from '../../src/rules/essential-configs';

// Mock the glob function instead of the entire module
vi.mock('fast-glob', () => ({
  glob: vi.fn(),
}));

describe('checkEssentialConfigFiles', () => {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- mock
  const mockProject = {
    projectFolder: '/path/to/project',
  } as RushConfigurationProject;

  it('Should check rules of lint file correctly', async () => {
    vi.mocked(glob).mockResolvedValue([]);

    const res = await checkEssentialConfigFiles.fn(mockProject);

    expect(res.length).toBe(2);
    expect(
      ['eslint.config.{cjs,mjs,js,ts,mts,cts}', 'tsconfig.json'].every(
        o => res.findIndex(r => r.content.startsWith(`\`${o}\``)) >= 0,
      ),
    ).toBe(true);
  });

  it('Should return empty if all files exits', async () => {
    vi.mocked(glob).mockResolvedValue(['some-file']);

    const res = await checkEssentialConfigFiles.fn(mockProject);
    expect(res.length).toBe(0);
  });

  it('Should use config', async () => {
    vi.mocked(glob).mockResolvedValue([]);

    const files = ['eslint.config.js', 'tsconfig.json'];
    const res = await checkEssentialConfigFiles.fn(mockProject, {
      essentialFiles: files,
    });
    expect(res.length).toBe(files.length);
    expect(
      files.every(
        o => res.findIndex(r => r.content.startsWith(`\`${o}\``)) >= 0,
      ),
    ).toBe(true);
  });
});
