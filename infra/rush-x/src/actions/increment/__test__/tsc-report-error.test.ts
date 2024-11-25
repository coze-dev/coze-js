import path from 'path';

import { logger as log } from '@/rush-logger';

import { reportError } from '../ts-check/report-error';
import { formatTsDiagnostics } from '../../../utils/ts-helper';
import { isCI } from '../../../utils/env';
import {
  addIssue,
  addReport,
  CIReportConclusion,
} from '../../../utils/ci-interactor';

vi.mock('../../../utils/ts-helper', () => ({
  formatTsDiagnostics: vi.fn(),
}));

vi.mock('@/rush-logger', () => ({
  default: { error: vi.fn(), success: vi.fn() },
}));

vi.mock('../../../utils/ci-interactor', () => ({
  addIssue: vi.fn(),
  addReport: vi.fn(),
  CIReportConclusion: {
    FAILED: 'failed',
  },
}));

vi.mock('path');

vi.mock('../../../utils/env', () => ({
  isCI: vi.fn(),
}));

describe('reportError', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should log error message and add issues and report when in CI or development environment', async () => {
    const diagnostics = [
      {
        diagnostics: [
          {
            filename: 'path/to/file.js',
            message: 'Example error message',
            error: 'error',
            line: 1,
          },
          {
            message: 'Example error message2',
            error: 'error',
          },
        ],
        packageName: 'abc',
      },
    ];
    const rootFolder = '/path/to/project';

    formatTsDiagnostics.mockReturnValue('Formatted error message');

    isCI.mockReturnValue(true);
    path.relative.mockReturnValue('path/to/file.js');

    await reportError(diagnostics, rootFolder);

    expect(log.error).toHaveBeenCalledWith(
      expect.stringContaining('should be resolved.'),
    );
    expect(addIssue).toHaveBeenCalledWith({
      path: 'path/to/file.js',
      rule: 'TS Type Check',
      message: 'Example error message',
      line: 1,
      severity: 'error',
    });
    expect(addIssue).toHaveBeenCalledWith({
      rule: 'TS Type Check',
      message: 'Example error message2',
      severity: 'error',
    });
    expect(addReport).toHaveBeenCalledWith({
      name: 'Typescript check',
      conclusion: CIReportConclusion.FAILED,
      output: {
        summary: expect.stringContaining('Typescript Check Failure'),
      },
    });
  });

  it('should log error message and not add issues or report when not in CI or development environment', async () => {
    const diagnostics = [
      {
        diagnostics: [
          {
            filename: 'path/to/file.js',
            message: 'Example error message',
            error: 'error',
            line: 1,
          },
          {
            message: 'Example error message2',
            error: 'error',
          },
        ],
        packageName: 'abc',
      },
    ];
    const rootFolder = '/path/to/project';

    formatTsDiagnostics.mockReturnValue('Formatted error message');

    isCI.mockReturnValue(false);

    await reportError(diagnostics, rootFolder);

    expect(addIssue).not.toHaveBeenCalled();
    expect(addReport).not.toHaveBeenCalled();
  });

  it('should report single exception in ci env.', async () => {
    const diagnostics = [
      {
        diagnostics: new Error('error example'),
        packageName: 'abc',
      },
    ];
    const rootFolder = '/path/to/project';

    formatTsDiagnostics.mockReturnValue('Formatted error message');

    isCI.mockReturnValue(true);

    await reportError(diagnostics, rootFolder);

    expect(addIssue).toHaveBeenCalledWith({
      rule: 'TS Type Check',
      message: 'error example',
      severity: 'error',
    });
    expect(addReport).toHaveBeenCalledWith({
      name: 'Typescript check',
      conclusion: CIReportConclusion.FAILED,
      output: {
        summary: expect.stringContaining('Typescript Check Failure'),
      },
    });
  });

  it('should report success in ci env.', async () => {
    const diagnostics = [];
    const rootFolder = '/path/to/project';

    formatTsDiagnostics.mockReturnValue('Formatted error message');

    isCI.mockReturnValue(true);

    await reportError(diagnostics, rootFolder);
    expect(addReport).toHaveBeenCalledWith({
      name: 'Typescript check',
      conclusion: CIReportConclusion.SUCCESS,
      output: {
        summary: 'GOOD',
        description: '',
      },
    });
  });
});
