import { vi, expect, describe, test } from 'vitest';
import { exec } from 'shelljs';

import { incrementAction } from '../action';

vi.mock('shelljs', () => ({ exec: vi.fn() }));

describe('increment', () => {
  test('incrementAction', () => {
    const fn = exec.mockImplementation(() => ({ stdout: '', stderr: '' }));

    incrementAction(['infra/rush-x/package.json'], 'test:cov');
    expect(fn.mock.calls[0][0]).toBe(
      [
        'node',
        'common/scripts/install-run-rush',
        'test:cov',
        '--impacted-by',
        '@/rush-x',
        '-v',
      ].join(' '),
    );

    incrementAction(['infra/rush-x/package.json'], 'build');
    expect(fn.mock.calls[1][0]).toBe(
      [
        'node',
        'common/scripts/install-run-rush',
        'build',
        '--impacted-by',
        '@/rush-x',
        '-v',
      ].join(' '),
    );

    // Do nothing if not match whitelist
    // incrementAction(['@apaas/rush-x'], 'lint');
    // expect(fn).toHaveBeenCalledTimes(0);
    // incrementAction(['@infra/flags'], 'lint');
    // expect(fn).toHaveLastReturnedWith(['common/scripts/install-run-rush', 'lint', '-o', '@infra/flags']);
  });
});
