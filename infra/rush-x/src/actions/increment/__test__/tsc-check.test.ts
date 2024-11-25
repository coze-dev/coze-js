import path from 'path';
import fs from 'fs/promises';

import * as ts from 'typescript';

import { checkPackage } from '../ts-check/ts-check-worker';
import * as resolveTsconfig from '../ts-check/resolve-tsconfig';
import * as tsHelper from '../../../utils/ts-helper';

vi.mock('typescript');

vi.mock('node:worker_threads', () => ({
  parentPort: { on: vi.fn() },
  isMainThread: false,
}));

describe('checkPackage', () => {
  let projectFolder: string,
    rootFolder: string,
    packageName: string,
    changedFiles: string[];

  beforeEach(() => {
    projectFolder = '/path/to/project';
    rootFolder = '/path/to/root';
    packageName = 'example-package';
    changedFiles = [
      '/path/to/file1.ts',
      '/path/to/file2.ts',
      '/path/to/file5.ts',
      '/path/to/file6.ts',
    ];
  });

  it('should return an array of DiagnosticInfo objects', async () => {
    const fullConfig = {
      errors: [],
    };

    const createTsProgramMock = vi.fn(() => 'program');
    const getPreEmitDiagnosticsMock = vi.fn(() => [
      {
        messageText: 'diagnostic1',
        file: { fileName: '/path/to/file1.ts', text: '' },
      },
      {
        messageText: 'diagnostic2',
        file: { fileName: '/path/to/file2.ts', text: '' },
      },
      // force pick all problems without `file` props.
      { messageText: 'diagnostic3' },
      // filter if fileName do not exists in `changedFiles`
      {
        messageText: 'diagnostic4',
        file: { fileName: '/path/to/file4.ts', text: '' },
      },
      // calculate line number by `start` & `text` content
      {
        messageText: 'diagnostic5',
        start: 2,
        file: { fileName: '/path/to/file5.ts', text: '\n\n' },
      },
      {
        messageText: {
          messageText: 'diagnostic6',
          start: 2,
          file: { fileName: '/path/to/file6.ts', text: '\n\n' },
        },
        start: 2,
        file: { fileName: '/path/to/file6.ts', text: '\n\n' },
      },
    ]);

    vi.spyOn(path, 'relative').mockReturnValue('relative/project');
    vi.spyOn(path, 'basename').mockReturnValue('tsconfig.json');
    vi.spyOn(fs, 'stat').mockResolvedValueOnce({ isFile: () => true });
    vi.spyOn(tsHelper, 'createTsProgram').mockImplementation(
      createTsProgramMock,
    );
    vi.spyOn(tsHelper, 'formatTsDiagnostics').mockImplementation(
      () => 'diagnosticText',
    );
    vi.spyOn(resolveTsconfig, 'resolveTsconfig').mockResolvedValueOnce(
      fullConfig,
    );
    vi.spyOn(ts, 'getPreEmitDiagnostics').mockImplementation(
      getPreEmitDiagnosticsMock,
    );

    const result = await checkPackage({
      projectFolder,
      rootFolder,
      packageName,
      changedFiles,
    });

    expect(result).toEqual([
      {
        filename: 'relative/project',
        message: 'diagnostic1',
        line: 1,
        error: 'diagnosticText',
      },
      {
        filename: 'relative/project',
        message: 'diagnostic2',
        line: 1,
        error: 'diagnosticText',
      },
      { message: 'diagnostic3', error: 'diagnosticText' },
      {
        message: 'diagnostic5',
        filename: 'relative/project',
        line: 3,
        error: 'diagnosticText',
      },
      {
        message: 'diagnostic6',
        filename: 'relative/project',
        line: 3,
        error: 'diagnosticText',
      },
    ]);
    expect(createTsProgramMock).toHaveBeenCalledWith(fullConfig, projectFolder);
    expect(getPreEmitDiagnosticsMock).toHaveBeenCalledWith('program');
    expect(tsHelper.createTsProgram).toHaveBeenCalledWith(
      fullConfig,
      projectFolder,
    );
    expect(ts.getPreEmitDiagnostics).toHaveBeenCalledWith('program');
  });

  it('should return an array of DiagnosticInfo objects including fullConfig errors', async () => {
    const fullConfig = {
      errors: [{ messageText: 'error1' }, { messageText: 'error2' }],
    };

    const createTsProgramMock = vi.fn(() => 'program');
    const getPreEmitDiagnosticsMock = vi.fn(() => [
      { messageText: 'diagnostic1' },
      { messageText: 'diagnostic2' },
    ]);

    vi.spyOn(path, 'relative').mockReturnValue('relative/project');
    vi.spyOn(path, 'basename').mockReturnValue('tsconfig.json');
    vi.spyOn(fs, 'stat').mockResolvedValueOnce({ isFile: () => true });
    vi.spyOn(tsHelper, 'createTsProgram').mockImplementation(
      createTsProgramMock,
    );
    vi.spyOn(tsHelper, 'formatTsDiagnostics').mockImplementation(
      () => 'diagnosticText',
    );
    vi.spyOn(resolveTsconfig, 'resolveTsconfig').mockResolvedValueOnce(
      fullConfig,
    );
    vi.spyOn(ts, 'getPreEmitDiagnostics').mockImplementation(
      getPreEmitDiagnosticsMock,
    );

    const result = await checkPackage({
      projectFolder,
      rootFolder,
      packageName,
      changedFiles,
    });

    expect(result).toEqual([
      {
        message: 'error1',
        error: 'diagnosticText',
      },
      {
        message: 'error2',
        error: 'diagnosticText',
      },
      {
        message: 'diagnostic1',
        error: 'diagnosticText',
      },
      {
        message: 'diagnostic2',
        error: 'diagnosticText',
      },
    ]);
  });
});
