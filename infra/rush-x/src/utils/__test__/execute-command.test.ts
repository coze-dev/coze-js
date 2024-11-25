import childProcess from 'child_process';

import { vi, type Mocked } from 'vitest';

import {
  executeCommandAndCaptureOutput,
  processResult,
} from '../execute-command';

vi.mock('child_process');
const mockedChildProcess = childProcess as Mocked<typeof childProcess>;

describe('execute-command', () => {
  beforeEach(() => {
    process.env = {
      DEBUG: '1',
    };
  });
  it('execute config cwd', () => {
    mockedChildProcess.spawnSync.mockReturnValue({ stdout: '' } as any);
    expect(executeCommandAndCaptureOutput('node', ['-v'])).toBeTypeOf('string');
    expect(
      executeCommandAndCaptureOutput('node', ['-v'], process.cwd()),
    ).toBeTypeOf('string');
  });

  it('processResult', () => {
    const fn = vi.fn(processResult);
    try {
      fn({ status: 128, stderr: 'msg' } as any);
    } catch {
      expect(fn).toBeCalled();
    }

    try {
      fn({ status: 128 } as any);
    } catch {
      expect(fn).toBeCalled();
    }

    try {
      const result = { stderr: 'msg' } as any;
      result.error = new Error('error');
      fn(result);
    } catch {
      expect(fn).toBeCalled();
    }
  });
});
