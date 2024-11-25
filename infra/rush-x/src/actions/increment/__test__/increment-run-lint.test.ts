// Import necessary dependencies
import path from 'path';
import fs from 'fs';

import { type Mock, type Mocked } from 'vitest';
import { exec } from 'shelljs';
import { type RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration';

import { runLint } from '../lint';
import * as utils from '../../../utils';

vi.mock('shelljs', () => ({ exec: vi.fn() }));
vi.mock('@/rush-logger', () => ({
  default: { debug: vi.fn(), success: vi.fn(), info: vi.fn() },
}));

// Mock dependencies
vi.mock('../../../utils');
const mockedUtils = utils as Mocked<typeof utils>;
vi.mock('fs');
const mockedFs = fs as Mocked<typeof fs>;

// Define the test case
describe('runLint', () => {
  beforeEach(() => {
    (exec as Mock).mockImplementation((a, b, cb) => {
      if (cb) {
        setTimeout(() => {
          cb(0, 'test', 'test');
        }, 100);
      }
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should run lint in each project', async () => {
    // Mock rushConfiguration
    const rushConfiguration = {
      rushJsonFolder: 'path/to/rushJsonFolder',
      getProjectByName: vi
        .fn()
        .mockReturnValueOnce({ projectFolder: 'path/to/projectFolder' })
        .mockReturnValueOnce({ projectFolder: 'path/to/projectFolder2' }),
    };
    mockedUtils.getRushConfiguration.mockReturnValue(
      rushConfiguration as unknown as RushConfiguration,
    );
    vi.spyOn(path, 'resolve').mockImplementation((...args: any) =>
      [...args].join('/'),
    );
    vi.spyOn(path, 'relative').mockImplementation((_, file) => file);

    // Mock changedFileGroup
    const changedFileGroup = {
      packageName1: ['file1.js', 'file2.js'],
      packageName2: ['file3.js', 'file4.js'],
    };

    // Mock readEslintIgnorePattern
    mockedFs.existsSync.mockReturnValue(true);
    mockedFs.readFileSync.mockReturnValue(`
      # Commented line
      .eslintrc.js
      dist/
    `);

    // Call the function to be tested
    await runLint(changedFileGroup);

    // Assertions
    expect(mockedUtils.getRushConfiguration).toHaveBeenCalledTimes(1);

    expect((exec as Mock).mock.calls[0]?.[0]).toMatch(
      [
        'npx',
        'eslint',
        '--quiet',
        'path/to/rushJsonFolder/file1.js',
        'path/to/rushJsonFolder/file2.js',
        '--no-error-on-unmatched-pattern',
      ].join(' '),
    );

    expect((exec as Mock).mock.calls[1]?.[0]).toMatch(
      [
        'npx',
        'eslint',
        '--quiet',
        'path/to/rushJsonFolder/file3.js',
        'path/to/rushJsonFolder/file4.js',
        '--no-error-on-unmatched-pattern',
      ].join(' '),
    );
  });

  it('should run lint with batch', async () => {
    // Mock rushConfiguration
    const rushConfiguration = {
      rushJsonFolder: 'path/to/rushJsonFolder',
      getProjectByName: vi
        .fn()
        .mockReturnValue({ projectFolder: 'path/to/projectFolder' }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mockedUtils.getRushConfiguration.mockReturnValue(rushConfiguration);
    vi.spyOn(path, 'resolve').mockImplementation((...args) =>
      [...args].join('/'),
    );
    vi.spyOn(path, 'relative').mockImplementation((_, file) => file);

    // Mock changedFileGroup
    const changedFiles = new Array(100).fill(1).map((_, i) => `file-${i}.js`);
    const changedFileGroup = {
      packageName1: changedFiles,
    };

    // Mock readEslintIgnorePattern
    mockedFs.existsSync.mockReturnValue(false);

    // Call the function to be tested
    await runLint(changedFileGroup);

    // Should be run Math.ceil(100/30) = 4 times
    expect((exec as Mock).mock.calls.length).toBe(4);
  });

  it('should filter no matched files', async () => {
    // Mock rushConfiguration
    const rushConfiguration = {
      rushJsonFolder: 'path/to/rushJsonFolder',
      getProjectByName: vi
        .fn()
        .mockReturnValue({ projectFolder: 'path/to/projectFolder' }),
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mockedUtils.getRushConfiguration.mockReturnValue(rushConfiguration);
    vi.spyOn(path, 'resolve').mockImplementation((...args) =>
      [...args].join('/'),
    );
    vi.spyOn(path, 'relative').mockImplementation((_, file) => file);

    // Mock changedFileGroup
    const changedFiles = [
      'file.js',
      'file.jsx',
      'file',
      'OWNERS',
      'file.cjs',
      'file.mjs',
      'file.json',
      'file.tsx',
      'file.ts',
    ];
    const changedFileGroup = {
      packageName1: changedFiles,
    };

    // Mock readEslintIgnorePattern
    mockedFs.existsSync.mockReturnValue(false);

    // Call the function to be tested
    await runLint(changedFileGroup);

    expect((exec as Mock).mock.calls[0][0]).toMatch(
      [
        'npx',
        'eslint',
        '--quiet',
        'path/to/rushJsonFolder/file.js',
        'path/to/rushJsonFolder/file.jsx',
        'path/to/rushJsonFolder/file.cjs',
        'path/to/rushJsonFolder/file.mjs',
        'path/to/rushJsonFolder/file.json',
        'path/to/rushJsonFolder/file.tsx',
        'path/to/rushJsonFolder/file.ts',
        '--no-error-on-unmatched-pattern',
      ].join(' '),
    );
  });
});
