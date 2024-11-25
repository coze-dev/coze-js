import { type Mock } from 'vitest';
import { infoAllow404, type PackageJSON } from '@evem/core';

import { getUnpublishedPackages } from '../get-unpublish-packages';

vi.mock('@evem/core');

describe('getUnpublishedPackages', () => {
  let infoAllow404Mock: Mock;

  beforeEach(() => {
    infoAllow404Mock = vi.fn();

    (infoAllow404 as Mock).mockImplementation(infoAllow404Mock);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return an empty array if packages array is empty', async () => {
    const packages: PackageJSON[] = [];

    const result = await getUnpublishedPackages(packages);

    expect(result).toEqual([]);
  });

  it('should return an empty array if all packages are already published', async () => {
    const packages: PackageJSON[] = [
      { name: 'package1', version: '1.0.0' },
      { name: 'package2', version: '2.0.0' },
    ];

    const response1 = { pkgInfo: { versions: ['1.0.0', '1.1.0'] } };
    const response2 = { pkgInfo: { versions: ['2.0.0', '2.1.0'] } };

    infoAllow404Mock
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const result = await getUnpublishedPackages(packages);

    expect(infoAllow404Mock).toHaveBeenCalledTimes(2);
    expect(infoAllow404Mock).toHaveBeenCalledWith(packages[0]);
    expect(infoAllow404Mock).toHaveBeenCalledWith(packages[1]);
    expect(result).toEqual([]);
  });

  it('should return an array of packages to publish if there are unpublished packages', async () => {
    const packages: PackageJSON[] = [
      { name: 'package1', version: '1.2.1' },
      { name: 'package2', version: '2.0.0' },
    ];

    const response1 = { pkgInfo: { versions: ['1.0.0', '1.1.0', '1.2.0'] } };
    const response2 = { pkgInfo: {} };

    infoAllow404Mock
      .mockResolvedValueOnce(response1)
      .mockResolvedValueOnce(response2);

    const result = await getUnpublishedPackages(packages);

    expect(infoAllow404Mock).toHaveBeenCalledTimes(2);
    expect(infoAllow404Mock).toHaveBeenCalledWith(packages[0]);
    expect(infoAllow404Mock).toHaveBeenCalledWith(packages[1]);
    expect(result).toEqual([
      {
        name: 'package1',
        localVersion: '1.2.1',
        publishedVersions: ['1.0.0', '1.1.0', '1.2.0'],
      },
      {
        name: 'package2',
        localVersion: '2.0.0',
        publishedVersions: [],
      },
    ]);
  });
});
