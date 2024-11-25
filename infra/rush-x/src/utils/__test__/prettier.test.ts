import { type Mock } from 'vitest';
import { format as _format, resolveConfig, resolveConfigFile } from 'prettier';

import { getRushConfiguration } from '../project-analyzer';
import { format } from '../prettier';

vi.mock('prettier', () => ({
  format: vi.fn(),
  resolveConfig: vi.fn(),
  resolveConfigFile: vi.fn(),
}));

vi.mock('../project-analyzer', () => ({ getRushConfiguration: vi.fn() }));

describe('prettier format with auto resolve config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should resolve config from filepath', async () => {
    (resolveConfig as Mock).mockResolvedValue({});
    await format('test code', '/path/foo/d.json');
    expect(resolveConfigFile).toBeCalledWith('/path/foo/d.json');

    expect(getRushConfiguration).not.toBeCalled();
    expect(_format).toBeCalledWith('test code', {
      filepath: '/path/foo/d.json',
    });
  });

  it('should resolve config from rush root', async () => {
    (getRushConfiguration as Mock).mockReturnValue({
      rushJsonFolder: '/path/to/root',
    });
    await format('test code');
    expect(resolveConfigFile).not.toBeCalled();

    expect(getRushConfiguration).toBeCalled();

    expect(_format).toBeCalledWith('test code', {
      filepath: undefined,
    });
  });
});
