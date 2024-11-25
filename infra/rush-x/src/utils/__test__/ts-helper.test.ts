import * as ts from 'typescript';

import {
  formatTsDiagnostics,
  parseFullTSConfig,
  createTsProgram,
} from '../ts-helper';

vi.mock('typescript', () => ({
  formatDiagnostics: vi.fn(),
  parseJsonConfigFileContent: vi.fn(),
  sys: {
    newLine: '\n',
    useCaseSensitiveFileNames: true,
    readDirectory: vi.fn(),
    fileExists: vi.fn(),
    readFile: vi.fn(),
  },
  createCompilerHost: vi.fn(),
  createProgram: vi.fn(),
}));

describe('formatTsDiagnostics', () => {
  it('should return empty string if diagnostics is empty', () => {
    const result = formatTsDiagnostics([], 'root');
    expect(result).toBe('');
    expect(ts.formatDiagnostics).not.toHaveBeenCalled();
  });

  it('should parse config', () => {
    const mockConfig = {};
    parseFullTSConfig(mockConfig, 'cwd');
    expect(ts.parseJsonConfigFileContent).toHaveBeenCalledWith(
      mockConfig,
      {
        useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
        readDirectory: ts.sys.readDirectory,
        fileExists: ts.sys.fileExists,
        readFile: ts.sys.readFile,
      },
      'cwd',
    );
  });

  it('should create program', () => {
    const mockConfig = { fileNames: [], options: {} };
    ts.createCompilerHost.mockReturnValue({});
    createTsProgram(mockConfig, 'cwd');

    expect(ts.createCompilerHost).toHaveBeenCalledWith(mockConfig.options);

    expect(ts.createProgram).toHaveBeenCalledWith({
      rootNames: mockConfig.fileNames,
      options: mockConfig.options,
      host: expect.anything(),
    });
  });

  // add more cases here
});
