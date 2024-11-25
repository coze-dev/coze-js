import path from 'path';
import os from 'os';
import fs from 'fs/promises';

import { isCI } from '../env';
import { addReport, addIssue } from '../ci-interactor';

vi.mock('fs/promises');
vi.mock('os');
vi.mock('path');
vi.mock('../env');

describe('addReport', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should write report file and invoke ::update-check-run::', async () => {
    // Arrange
    const message = {
      name: 'Test Report',
      conclusion: 'success',
      output: {
        summary: 'This is a test report summary',
      },
    };
    const formattedMsg = { ...message, conclusion: 'success' };
    const tmpReportFile = '/tmp/ci-Test_Report-1234567890.json';

    os.tmpdir.mockReturnValue('/tmp');
    path.resolve.mockReturnValue(tmpReportFile);
    fs.writeFile.mockResolvedValueOnce();

    isCI.mockReturnValue(true);
    vi.spyOn(console, 'log').mockImplementation(vi.fn());

    // Act
    await addReport(message);

    // Assert
    expect(os.tmpdir).toHaveBeenCalled();
    expect(path.resolve.mock.calls[0][1].endsWith('.json')).toBe(true);
    expect(fs.writeFile).toHaveBeenCalledWith(
      tmpReportFile,
      JSON.stringify(formattedMsg, null, '  '),
      'utf-8',
    );
    expect(console.log).toHaveBeenCalledWith(
      `::update-check-run ::${tmpReportFile}`,
    );
  });
});

describe('addIssue', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log');
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('should log the correct message to the console', () => {
    const issue = {
      rule: 'example-rule',
      message: 'This is an example issue.',
      line: 42,
      path: 'path/to/file.js',
      severity: 'error',
    };

    addIssue(issue);

    const expectedMessage = `::add-issue path=${issue.path},line=${issue.line},severity=${issue.severity},rule=${issue.rule}::${issue.message}`;

    expect(consoleLogSpy).toHaveBeenCalledWith(expectedMessage);
  });
});
