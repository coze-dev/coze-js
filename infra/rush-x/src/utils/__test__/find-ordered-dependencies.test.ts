import { vi, test } from 'vitest';
import { type RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration';

import * as projectAnalyzer from '../project-analyzer';
import { findOrderDependencies } from '../find-ordered-dependencies';

describe('findOrderDependencies', () => {
  test('returns the single package name if there are no dependencies', () => {
    const packageName = 'packageA';
    const packagesByName = new Map([
      [
        packageName,
        {
          packageName,
          packageJson: {
            name: packageName,
            version: '0.1.0',
          },
          shouldPublish: true,
        },
      ],
    ]);

    vi.spyOn(projectAnalyzer, 'getRushConfiguration').mockImplementationOnce(
      () =>
        ({
          projectsByName: packagesByName,
        }) as unknown as RushConfiguration,
    );

    const orderDependencies = findOrderDependencies([packageName]);

    expect(orderDependencies).toEqual([
      {
        packageName,
        version: '0.1.0',
      },
    ]);
  });

  it('returns the two package names in dependency order', () => {
    const packageNameA = 'packageA';
    const packageNameB = 'packageB';
    const packagesByName = new Map([
      [
        packageNameA,
        {
          packageName: packageNameA,
          packageJson: {
            name: packageNameA,
            version: '1.0.0',
            dependencies: {
              [packageNameB]: '1.0.0',
            },
          },
          shouldPublish: true,
        },
      ],
      [
        packageNameB,
        {
          packageName: packageNameB,
          packageJson: {
            name: packageNameB,
            version: '1.0.0',
          },
          shouldPublish: true,
        },
      ],
    ]);

    vi.spyOn(projectAnalyzer, 'getRushConfiguration').mockImplementationOnce(
      () =>
        ({
          projectsByName: packagesByName,
        }) as unknown as RushConfiguration,
    );

    const orderDependencies = findOrderDependencies([
      packageNameA,
      packageNameB,
    ]);

    expect(orderDependencies).toEqual([
      {
        packageName: packageNameB,
        version: '1.0.0',
      },
      { packageName: packageNameA, version: '1.0.0' },
    ]);
  });

  it('returns the four package names in dependency order', () => {
    const packageNameA = 'packageA';
    const packageNameB = 'packageB';
    const packageNameC = 'packageC';
    const packageNameD = 'packageD';

    const packagesByName = new Map([
      [
        packageNameA,
        {
          packageName: packageNameA,
          packageJson: {
            name: packageNameA,
            dependencies: {
              [packageNameB]: '1.0.0',
            },
            version: '1.0.0',
          },
          shouldPublish: true,
        },
      ],
      [
        packageNameB,
        {
          packageName: packageNameB,
          packageJson: {
            name: packageNameB,
            dependencies: {
              [packageNameC]: '1.0.0',
            },
            version: '1.0.0',
          },
          shouldPublish: true,
        },
      ],
      [
        packageNameC,
        {
          packageName: packageNameC,
          packageJson: {
            name: packageNameC,
            dependencies: {
              [packageNameD]: '1.0.0',
            },
            version: '1.0.0',
          },
          shouldPublish: true,
        },
      ],
      [
        packageNameD,
        {
          packageName: packageNameD,
          packageJson: {
            name: packageNameD,
            version: '1.0.0',
          },
          shouldPublish: true,
        },
      ],
    ]);

    vi.spyOn(projectAnalyzer, 'getRushConfiguration').mockImplementationOnce(
      () =>
        ({
          projectsByName: packagesByName,
        }) as unknown as RushConfiguration,
    );

    const orderDependencies = findOrderDependencies([
      packageNameA,
      packageNameB,
      packageNameC,
      packageNameD,
    ]);

    expect(orderDependencies).toEqual([
      { packageName: packageNameD, version: '1.0.0' },
      { packageName: packageNameC, version: '1.0.0' },
      { packageName: packageNameB, version: '1.0.0' },
      { packageName: packageNameA, version: '1.0.0' },
    ]);
  });

  it('throws an error if a dependency is missing', () => {
    const packageNameA = 'packageA';
    const packageNameMissing = 'missingPackage';

    const packagesByName = new Map([
      [
        packageNameA,
        {
          packageName: packageNameA,
          packageJson: {
            name: packageNameA,
            dependencies: {
              [packageNameMissing]: '1.0.0',
            },
            version: '1.0.0',
          },
        },
      ],
    ]);

    vi.spyOn(projectAnalyzer, 'getRushConfiguration').mockImplementationOnce(
      () =>
        ({
          projectsByName: packagesByName,
        }) as unknown as RushConfiguration,
    );

    expect(() =>
      findOrderDependencies([packageNameA, packageNameMissing]),
    ).toThrowError(
      new Error(
        `The package ${packageNameMissing} was requested for publishing but does not exist.`,
      ),
    );
  });

  it('return null if a package depends on itself', () => {
    const packageNameA = 'packageA';

    const packagesByName = new Map([
      [
        packageNameA,
        {
          packageName: packageNameA,
          packageJson: {
            name: packageNameA,
            dependencies: {
              [packageNameA]: '1.0.0',
            },
            version: '1.0.0',
          },
        },
      ],
    ]);

    vi.spyOn(projectAnalyzer, 'getRushConfiguration').mockImplementationOnce(
      () =>
        ({
          projectsByName: packagesByName,
        }) as unknown as RushConfiguration,
    );

    expect(findOrderDependencies([packageNameA])).toEqual([]);
  });
});
