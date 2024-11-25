import fs from 'fs';

import { vi, type Mocked } from 'vitest';
import axios from 'axios';

import {
  checkPackageVersionExists,
  downloadPackageTarball,
  publishToNPM,
} from '../npm';
import * as executeCommand from '../execute-command';

const mockedAxios = axios as Mocked<typeof axios>;
describe('npm test', () => {
  test('checkPackageVersionExists - existing package version', async () => {
    const packageName = 'your-package';
    const version = '1.0.0';
    mockedAxios.get.mockResolvedValueOnce({ status: 200 });
    const exists = await checkPackageVersionExists(packageName, version);

    expect(exists).toBe(true);
  });

  test('checkPackageVersionExists - non-existing package version', async () => {
    const packageName = 'your-package';
    const version = '2.0.0';
    mockedAxios.get.mockResolvedValueOnce({ status: 404 });
    const exists = await checkPackageVersionExists(packageName, version);

    expect(exists).toBe(false);
  });

  test('checkPackageVersionExists - error response', async () => {
    const packageName = 'your-package';
    const version = '1.0.0';

    // Mocking the error response
    mockedAxios.get.mockRejectedValueOnce({ status: 500 });

    await expect(
      checkPackageVersionExists(packageName, version),
    ).rejects.toThrow();
  });

  test('downloadPackageTarball', async () => {
    const packages = [
      {
        packageName: 'package1',
        version: '1.0.0',
        customFolder: 'custom/folder',
      },
      { packageName: 'package2', version: '2.0.0' },
    ];

    mockedAxios.get.mockImplementation(url => {
      switch (url) {
        case 'http://example.com/package1-1.0.0.tar.gz':
          return Promise.resolve({
            data: {
              pipe: vi.fn(),
            },
          });
        default: {
          return Promise.resolve({
            data: {
              dist: { tarball: 'http://example.com/package1-1.0.0.tar.gz' },
            },
          });
        }
      }
    });

    vi.spyOn(fs, 'existsSync').mockImplementation(() => true);

    const downloadResult = await downloadPackageTarball(packages);

    expect(downloadResult).toHaveLength(2);
    expect(downloadResult[0].packageName).toBe('package1');
    expect(downloadResult[0].version).toBe('1.0.0');
    expect(downloadResult[0].saveFolder).toBe('custom/folder');
    expect(downloadResult[0].fileName).toBe('package1-1.0.0.tar.gz');
  });

  test('publishToNPM', () => {
    const publishDir = 'path/to/publish';
    const cwd = 'current/working/directory';
    const dryRun = true;

    // Mocking the executeCommandAndCaptureOutput function
    vi.spyOn(
      executeCommand,
      'executeCommandAndCaptureOutput',
    ).mockImplementationOnce(() => 'mock');

    publishToNPM(publishDir, cwd, dryRun);

    expect(executeCommand.executeCommandAndCaptureOutput).toHaveBeenCalledWith(
      'npm',
      ['publish', publishDir, '--json', '--access', 'public', '--dry-run'],
      cwd,
      {
        npm_config_registry: 'https://registry.npmjs.org',
      },
    );
  });
});
