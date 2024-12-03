import {
  formatDiagnostics,
  parseJsonConfigFileContent,
  createProgram,
  createCompilerHost,
  sys,
  type Diagnostic,
  type Program,
  type ParsedCommandLine,
} from 'typescript';

export const formatTsDiagnostics = (
  diagnostics: Diagnostic[],
  projectRoot: string,
): string => {
  if (diagnostics?.length <= 0) {
    return '';
  }
  return formatDiagnostics(diagnostics, {
    getCanonicalFileName: p => p,
    getCurrentDirectory: () => projectRoot,
    getNewLine: () => sys.newLine,
  });
};

export const parseFullTSConfig = (
  extendsConfig: Record<string, unknown>,
  cwd: string,
): ParsedCommandLine => {
  const config = parseJsonConfigFileContent(
    extendsConfig,
    {
      useCaseSensitiveFileNames: sys.useCaseSensitiveFileNames,
      readDirectory: sys.readDirectory,
      fileExists: sys.fileExists,
      readFile: sys.readFile,
    },
    cwd,
  );
  return config;
};

export const createTsProgram = (
  config: ParsedCommandLine,
  cwd: string,
): Program => {
  const host = createCompilerHost(config.options);
  host.getCurrentDirectory = () => cwd;
  return createProgram({
    rootNames: config.fileNames,
    options: config.options,
    host,
  });
};
