import os from 'os';

import { exec } from '../exec';
import { isCI, getCPUSize, whoAmI } from '../env';

vi.mock('os', () => ({
  default: {
    cpus: vi.fn(),
  },
}));
vi.mock('../exec', () => ({
  exec: vi.fn(),
}));

describe('env', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should return ci flags exactly', () => {
    vi.stubEnv('CI', 'true');
    expect(isCI()).toBe(true);

    // vi.stubGlobal('process.env.CI', undefined);
    vi.unstubAllEnvs();
    vi.spyOn(process, 'env', 'get').mockReturnValue({ CI: undefined });
    expect(isCI()).toBe(false);
  });

  it('should directly return cpu size in common env', () => {
    // for common env
    vi.spyOn(process, 'env', 'get').mockReturnValue({ CI: undefined });
    os.cpus.mockReturnValue(new Array(100).fill(1));
    expect(getCPUSize()).toBe(100);

    os.cpus.mockReturnValue(new Array(10).fill(1));
    expect(getCPUSize()).toBe(10);
  });

  it('should return cpu size of threshold', () => {
    // for ci env
    vi.stubEnv('CI', 'true');
    os.cpus.mockReturnValue(new Array(100).fill(1));
    expect(getCPUSize()).toBe(32);

    os.cpus.mockReturnValue(new Array(10).fill(1));
    expect(getCPUSize()).toBe(10);
  });

  it('should call git config with async mode', async () => {
    exec.mockResolvedValueOnce({ stdout: 'test\n' });
    exec.mockResolvedValueOnce({ stdout: 'test@bytedance.com\n' });

    const res = await whoAmI();

    expect(exec.mock.calls[0][0]).toBe('git config user.name');
    expect(exec.mock.calls[1][0]).toBe('git config user.email');

    expect(res).toEqual({ name: 'test', email: 'test@bytedance.com' });
  });
});
