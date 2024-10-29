import path from 'node:path';
import fs from 'node:fs';

const isExistsSync = (file: string) => {
  try {
    const stat = fs.statSync(file);
    return stat.isFile();
  } catch (e) {
    return false;
  }
};

const isRushRoot = (dir: string) => {
  const rushFile = path.resolve(dir, 'rush.json');
  return isExistsSync(rushFile);
};

const lookupAllGitignore = (cwd: string): string[] => {
  const gitignoreFile = path.resolve(cwd, '.gitignore');
  const res: string[] = [];
  if (isExistsSync(gitignoreFile)) {
    res.push(gitignoreFile);
  }
  if (isRushRoot(cwd) === false) {
    res.push(...lookupAllGitignore(path.dirname(cwd)));
  }
  return res;
};

const readAllGitignoreRules = (cwd: string): string => {
  const allFiles = lookupAllGitignore(cwd);
  const rules = allFiles.map(r => fs.readFileSync(r, 'utf-8')).join('\n');
  return rules;
};

/**
 * Converts an ESLint ignore pattern to a minimatch pattern.
 * @param {string} pattern The .eslintignore or .gitignore pattern to convert.
 * @returns {string} The converted pattern.
 */
const convertIgnorePatternToMinimatch = (pattern: string) => {
  const isNegated = pattern.startsWith('!');
  const negatedPrefix = isNegated ? '!' : '';
  const patternToTest = (isNegated ? pattern.slice(1) : pattern).trimEnd();

  // special cases
  if (['', '**', '/**', '**/'].includes(patternToTest)) {
    return `${negatedPrefix}${patternToTest}`;
  }

  const firstIndexOfSlash = patternToTest.indexOf('/');

  const matchEverywherePrefix =
    firstIndexOfSlash < 0 || firstIndexOfSlash === patternToTest.length - 1
      ? '**/'
      : '';

  const patternWithoutLeadingSlash =
    firstIndexOfSlash === 0 ? patternToTest.slice(1) : patternToTest;

  /*
   * Escape `{` and `(` because in gitignore patterns they are just
   * literal characters without any specific syntactic meaning,
   * while in minimatch patterns they can form brace expansion or extglob syntax.
   *
   * For example, gitignore pattern `src/{a,b}.js` ignores file `src/{a,b}.js`.
   * But, the same minimatch pattern `src/{a,b}.js` ignores files `src/a.js` and `src/b.js`.
   * Minimatch pattern `src/\{a,b}.js` is equivalent to gitignore pattern `src/{a,b}.js`.
   */
  const escapedPatternWithoutLeadingSlash =
    patternWithoutLeadingSlash.replaceAll(
      /(?=((?:\\.|[^{(])*))\1([{(])/guy,
      '$1\\$2',
    );

  const matchInsideSuffix = patternToTest.endsWith('/**') ? '/*' : '';

  return `${negatedPrefix}${matchEverywherePrefix}${escapedPatternWithoutLeadingSlash}${matchInsideSuffix}`;
};

export function includeIgnoreFile(cwd: string) {
  if (!path.isAbsolute(cwd)) {
    throw new Error('The ignore file location must be an absolute path.');
  }

  const lines = readAllGitignoreRules(cwd).split(/\r?\n/u);

  const ignorePatterns = lines
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(convertIgnorePatternToMinimatch);
  return ignorePatterns;
}
