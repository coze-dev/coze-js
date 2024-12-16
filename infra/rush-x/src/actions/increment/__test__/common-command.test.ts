import { exec } from 'shelljs';
import { logger } from '@coze-infra/rush-logger';

import { reportRushLog } from '../common-command/report-to-ci';
import { runCommonCommands } from '../common-command';
import { getRushConfiguration } from '../../../utils/project-analyzer';

// Mock dependencies
vi.mock('shelljs', () => ({
  exec: vi.fn(),
}));
vi.mock('@coze-infra/rush-logger');
vi.mock('../../../utils/project-analyzer');
vi.mock('../common-command/report-to-ci');

describe('runCommonCommands', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getRushConfiguration
    (getRushConfiguration as vi.Mock).mockReturnValue({
      rushJsonFolder: '/path/to/rush',
    });
    // Mock performance.now
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1000);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should execute rush command with correct arguments for test:cov action', () => {
    const packages = ['package1', 'package2'];
    const action = 'test:cov';

    (exec as vi.Mock).mockReturnValue({ code: 0 });

    runCommonCommands(packages, action);

    expect(exec).toHaveBeenCalledWith(
      'node common/scripts/install-run-rush test:cov --from package1 --from package2 -v',
      {
        cwd: '/path/to/rush',
        fatal: false,
      },
    );
    expect(logger.info).toHaveBeenCalledWith(
      'Start running: node common/scripts/install-run-rush test:cov --from package1 --from package2 -v',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'finish exec command with exit code: 0',
    );
    expect(reportRushLog).toHaveBeenCalledWith(
      { code: 0 },
      {
        command:
          'node common/scripts/install-run-rush test:cov --from package1 --from package2 -v',
        duration: 1000,
        action: 'test:cov',
      },
    );
  });

  it('should execute rush command with correct arguments for lint action', () => {
    const packages = ['package1'];
    const action = 'lint';

    (exec as vi.Mock).mockReturnValue({ code: 0 });

    runCommonCommands(packages, action);

    expect(exec).toHaveBeenCalledWith(
      'node common/scripts/install-run-rush lint --from package1',
      {
        cwd: '/path/to/rush',
        fatal: false,
      },
    );
  });

  it('should handle command execution failure', () => {
    const packages = ['package1'];
    const action = 'build';

    (exec as vi.Mock).mockReturnValue({ code: 1 });

    runCommonCommands(packages, action);

    expect(logger.error).toHaveBeenCalledWith(
      'finish exec command with exit code: 1',
    );
    expect(process.exitCode).toBe(1);
  });

  it('should add -v flag for specific actions', () => {
    const testCases = [
      { action: 'test:cov', shouldHaveVFlag: true },
      { action: 'build', shouldHaveVFlag: true },
      { action: 'perf-defender', shouldHaveVFlag: true },
      { action: 'lint', shouldHaveVFlag: false },
    ];

    testCases.forEach(({ action, shouldHaveVFlag }) => {
      (exec as vi.Mock).mockReturnValue({ code: 0 });

      runCommonCommands(['package1'], action);

      const expectedCommand = `node common/scripts/install-run-rush ${action} --from package1${
        shouldHaveVFlag ? ' -v' : ''
      }`;
      expect(exec).toHaveBeenCalledWith(expectedCommand, {
        cwd: '/path/to/rush',
        fatal: false,
      });
    });
  });
});
