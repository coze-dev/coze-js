import { logger as log } from '@/rush-logger';

import { reportError } from '../ts-check/report-error';
import { runTsCheck } from '../ts-check/index';

// Mock dependencies
vi.mock('@/rush-logger', () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../../utils', () => ({
  getRushConfiguration: vi.fn(() => ({
    rushJsonFolder: 'path/to/rushJsonFolder',
    getProjectByName: vi.fn(packageName => ({
      projectFolder: `path/to/${packageName}`,
    })),
  })),
}));

const mockedRun = vi.fn();

vi.mock('../../../utils/worker-pool', () => ({
  WorkerPool: {
    createPool: vi.fn(() => ({
      run: mockedRun,
      stop: vi.fn(),
    })),
  },
}));

vi.mock('../ts-check/report-error', () => ({
  reportError: vi.fn(),
}));

describe('runTsCheck', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should exit early if no packages are passed', async () => {
    await runTsCheck({});

    expect(log.info).toHaveBeenCalledWith('Nothing todo, pass.');
    expect(log.info).toHaveBeenCalledTimes(1);
  });

  it('should run ts check for each package and report errors', async () => {
    // 空数组应该会被过滤
    mockedRun.mockResolvedValueOnce([]);
    mockedRun.mockResolvedValueOnce([{ error: 'Error message' }]);
    await runTsCheck({
      package1: ['file1.ts', 'file2.ts'],
      package2: ['file3.ts'],
    });
    expect(mockedRun).toBeCalledTimes(2);

    expect(reportError).toHaveBeenCalledWith(
      [
        {
          packageName: 'package2',
          diagnostics: [{ error: 'Error message' }],
        },
      ],
      'path/to/rushJsonFolder',
    );
  });
});
