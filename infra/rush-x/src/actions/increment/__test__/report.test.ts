/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type shell from 'shelljs';

import { report as stylelintReport } from '../stylelint/report';
import { report as packageAuditReport } from '../package-audit/report';
import { report as lintReport } from '../lint/report';
import { reportRushLog } from '../common-command/report-to-ci';
import { isCI } from '../../../utils/env';
import { addReport, CIReportConclusion } from '../../../utils/ci-interactor';

// Mock dependencies
vi.mock('../../../utils/env', () => ({
  isCI: vi.fn(),
}));

vi.mock('../../../utils/ci-interactor', () => ({
  addReport: vi.fn(),
  CIReportConclusion: {
    SUCCESS: 'success',
    FAILED: 'failed',
  },
}));

vi.mock('../../../utils/logger', () => ({
  logger: {
    error: vi.fn(),
  },
}));

describe('reportRushLog', () => {
  const mockContext = {
    command: 'rush build -t @example/package',
    duration: 1000,
    action: 'build',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should report success status in CI environment', () => {
    (isCI as vi.Mock).mockReturnValue(true);

    const mockRes = {
      code: 0,
      stdout: '',
    } as shell.ShellString;

    reportRushLog(mockRes, mockContext);

    expect(addReport).toHaveBeenCalledWith({
      conclusion: CIReportConclusion.SUCCESS,
      name: 'Increment run build',
      output: { summary: '' },
    });
  });

  it('should not report in non-CI and non-development environment', () => {
    (isCI as vi.Mock).mockReturnValue(false);
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const mockRes = {
      code: 1,
      stdout: '',
    } as shell.ShellString;

    reportRushLog(mockRes, mockContext);

    expect(addReport).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should correctly parse and report failure information', () => {
    (isCI as vi.Mock).mockReturnValue(true);

    const mockStdout = `
Selected 3 operations
SUCCESS: 1 operations
FROM CACHE: 1 operations
================[ FAILURE: 1 operations ]================
-----------[ FAILURE: @example/package ]-----------
Error: Build failed
==========[ @example/package ]==========
npm ERR! code 1
npm ERR! Failed at build script
==========[ @other/package ]==========
    `;

    const mockRes = {
      code: 1,
      stdout: mockStdout,
    } as shell.ShellString;

    reportRushLog(mockRes, mockContext);

    expect(addReport).toHaveBeenCalledWith({
      conclusion: CIReportConclusion.FAILED,
      name: 'Increment run build',
      output: {
        summary: expect.stringContaining(
          '# ❌ Rush Increment run build failure',
        ),
      },
    });
  });

  it('should report success when there are no failed operations', () => {
    (isCI as vi.Mock).mockReturnValue(true);

    const mockStdout = `
Selected 2 operations
SUCCESS: 1 operations
FROM CACHE: 1 operations
    `;

    const mockRes = {
      code: 0,
      stdout: mockStdout,
    } as shell.ShellString;

    reportRushLog(mockRes, mockContext);

    expect(addReport).toHaveBeenCalledWith({
      conclusion: CIReportConclusion.SUCCESS,
      name: 'Increment run build',
      output: { summary: '' },
    });
  });
});

describe('lint report', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should report success when no lint errors', async () => {
    (isCI as vi.Mock).mockReturnValue(true);
    const lintResult: {
      packageName: string;
      diagnostics: string;
      hasError: boolean;
    }[] = [];

    await lintReport(lintResult);

    expect(addReport).toHaveBeenCalledWith({
      name: 'ESLint Detect',
      conclusion: CIReportConclusion.SUCCESS,
      output: {
        summary: '',
        description: '',
      },
    });
  });

  it('should report failure with lint errors', async () => {
    (isCI as vi.Mock).mockReturnValue(true);
    process.env.targetBranch = 'main';

    const lintResult = [
      {
        packageName: '@test/package',
        diagnostics: 'Error: some lint error',
        hasError: true,
      },
    ];

    await lintReport(lintResult);

    expect(addReport).toHaveBeenCalledWith({
      name: 'ESLint Detect',
      conclusion: CIReportConclusion.FAILED,
      output: {
        summary: expect.stringContaining('❌ ESLint Detect'),
      },
    });
  });
});

describe('package-audit report', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should report success when no audit issues', async () => {
    (isCI as vi.Mock).mockReturnValue(true);
    const diagnostics = [];

    await packageAuditReport(diagnostics);

    expect(addReport).toHaveBeenCalledWith({
      name: 'Package Audit Checker',
      conclusion: CIReportConclusion.SUCCESS,
      output: {
        summary: expect.stringContaining('Every things looks fine'),
      },
    });
  });

  it('should report failure with error level issues', async () => {
    (isCI as vi.Mock).mockReturnValue(true);
    process.env.targetBranch = 'main';

    const diagnostics = [
      {
        level: 'error',
        packageName: '@test/package',
        rule: 'no-vulnerabilities',
        content: 'Found security vulnerability',
      },
    ];

    await packageAuditReport(diagnostics);

    expect(addReport).toHaveBeenCalledWith({
      name: 'Package Audit Checker',
      conclusion: CIReportConclusion.FAILED,
      output: {
        summary: expect.stringContaining('❌ Package Audit Checker'),
      },
    });
  });
});

describe('stylelint report', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should report success when no style errors', async () => {
    (isCI as vi.Mock).mockReturnValue(true);
    const results = [];

    await stylelintReport(results, 'Stylelint Check');

    expect(addReport).toHaveBeenCalledWith({
      name: 'Stylelint Check',
      conclusion: CIReportConclusion.SUCCESS,
      output: {
        summary: '',
        description: '',
      },
    });
  });

  it('should report failure with style errors', async () => {
    (isCI as vi.Mock).mockReturnValue(true);
    process.env.targetBranch = 'main';

    const results = [
      {
        errors: [
          {
            source: 'style.css',
            warnings: [
              {
                line: 1,
                column: 1,
                severity: 'error',
                text: 'Invalid property',
                rule: 'property-no-unknown',
              },
            ],
          },
        ],
        files: ['style.css'],
        projectFolder: '/test',
        packageName: '@test/package',
      },
    ];

    await stylelintReport(results, 'Stylelint Check');

    expect(addReport).toHaveBeenCalledWith({
      name: 'Stylelint Check',
      conclusion: CIReportConclusion.FAILED,
      output: {
        summary: expect.stringContaining('❌ Stylelint Detect Result'),
      },
    });
  });
});
