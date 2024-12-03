import path from 'path';

import { resolveTsconfig } from '../ts-check/resolve-tsconfig';
import { parseFullTSConfig } from '../../../utils/ts-helper';

vi.mock('../../../utils/ts-helper', () => ({
  parseFullTSConfig: vi.fn(),
}));

describe('resolveTsconfig', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return the parsed TypeScript config with default options', async () => {
    const configFile = 'tsconfig.json';
    const projectFolder = '/path/to/project';
    const mockParsedConfig = { options: { outDir: './ts-check' } };

    parseFullTSConfig.mockReturnValue(mockParsedConfig);

    const result = await resolveTsconfig(configFile, projectFolder);

    expect(parseFullTSConfig).toHaveBeenCalledWith(
      {
        extends: configFile,
      },
      projectFolder,
    );

    expect(result).toEqual({
      ...mockParsedConfig,
      options: {
        ...mockParsedConfig.options,
        tsBuildInfoFile: path.join(
          mockParsedConfig.options.outDir,
          '.tsbuildinfo',
        ),
        noEmit: false,
      },
    });
  });
});
