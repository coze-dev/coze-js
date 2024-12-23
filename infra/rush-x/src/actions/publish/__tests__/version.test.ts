import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import semver from 'semver';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';

import { generatePublishManifest } from '../version';
import { BumpType } from '../types';
import * as requestBumpTypeModule from '../request-bump-type';
import * as randomModule from '../../../utils/random';

// Mock 所有依赖
vi.mock('semver');
vi.mock('../../../utils/random');
vi.mock('../request-bump-type');

describe('version management', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // 设置默认的 semver mock
    vi.mocked(semver.parse).mockImplementation(
      version =>
        ({
          major: 1,
          minor: 0,
          patch: 0,
          prerelease: [],
          version,
        }) as any,
    );
    vi.mocked(semver.inc).mockImplementation(version => `${version}-mocked`);
    vi.mocked(semver.valid).mockImplementation(version =>
      version === 'invalid' ? null : '1.0.0',
    );

    // Mock random hash
    vi.mocked(randomModule.randomHash).mockReturnValue('abc123');

    // Mock request bump type
    vi.mocked(requestBumpTypeModule.requstBumpType).mockResolvedValue(
      BumpType.PATCH,
    );
  });

  describe('generatePublishManifest', () => {
    const mockProject: RushConfigurationProject = {
      packageJson: {
        version: '1.0.0',
      },
    } as any;

    it('should handle specified version', async () => {
      const packages = new Set([mockProject]);
      const options = { version: '2.0.0' };

      const result = await generatePublishManifest(packages, options);

      expect(result).toEqual({
        manifests: [
          {
            project: mockProject,
            currentVersion: '1.0.0',
            newVersion: '2.0.0',
          },
        ],
        bumpPolicy: '2.0.0',
      });
    });

    it('should handle specified bump type', async () => {
      const packages = new Set([mockProject]);
      const options = { bumpType: BumpType.PATCH };
      vi.mocked(semver.inc).mockReturnValueOnce('1.0.1');

      const result = await generatePublishManifest(packages, options);

      expect(result).toEqual({
        manifests: [
          {
            project: mockProject,
            currentVersion: '1.0.0',
            newVersion: '1.0.1',
          },
        ],
        bumpPolicy: BumpType.PATCH,
      });
    });

    it('should handle interactive bump type selection', async () => {
      const packages = new Set([mockProject]);
      const options = {};
      vi.mocked(semver.inc).mockReturnValueOnce('1.0.1');

      const result = await generatePublishManifest(packages, options);

      expect(requestBumpTypeModule.requstBumpType).toHaveBeenCalled();
      expect(result).toEqual({
        manifests: [
          {
            project: mockProject,
            currentVersion: '1.0.0',
            newVersion: '1.0.1',
          },
        ],
        bumpPolicy: BumpType.PATCH,
      });
    });

    it('should throw error for invalid version', async () => {
      const packages = new Set([mockProject]);
      const options = { version: 'invalid' };
      vi.mocked(semver.valid).mockReturnValueOnce(null);

      await expect(generatePublishManifest(packages, options)).rejects.toThrow(
        'Invalid version specified',
      );
    });

    it('should throw error when version selection is cancelled', async () => {
      const packages = new Set([mockProject]);
      const options = {};
      vi.mocked(requestBumpTypeModule.requstBumpType).mockResolvedValueOnce(
        null,
      );

      await expect(generatePublishManifest(packages, options)).rejects.toThrow(
        'Version selection was cancelled',
      );
    });
  });

  describe('version calculation', () => {
    const testCases = [
      {
        type: BumpType.PATCH,
        currentVersion: '1.0.0',
        expected: '1.0.1',
        prerelease: [],
      },
      {
        type: BumpType.MINOR,
        currentVersion: '1.0.0',
        expected: '1.1.0',
        prerelease: [],
      },
      {
        type: BumpType.MAJOR,
        currentVersion: '1.0.0',
        expected: '2.0.0',
        prerelease: [],
      },
      {
        type: BumpType.BETA,
        currentVersion: '1.0.0',
        expected: '1.0.0-beta.1',
        prerelease: [],
      },
      {
        type: BumpType.BETA,
        currentVersion: '1.0.0-beta.1',
        expected: '1.0.0-beta.2',
        prerelease: ['beta', '1'],
      },
      {
        type: BumpType.ALPHA,
        currentVersion: '1.0.0',
        expected: '1.0.0-alpha.abc123',
        prerelease: [],
      },
      {
        type: BumpType.ALPHA,
        currentVersion: '1.0.0-alpha.1',
        expected: '1.0.0-alpha.abc123',
        prerelease: ['alpha', '1'],
      },
    ];

    testCases.forEach(({ type, currentVersion, expected, prerelease }) => {
      it(`should handle ${type} bump for version ${currentVersion}`, async () => {
        const packages = new Set([
          {
            packageJson: { version: currentVersion },
          } as any,
        ]);

        vi.mocked(semver.parse).mockReturnValueOnce({
          major: 1,
          minor: 0,
          patch: 0,
          prerelease,
          version: currentVersion,
        } as any);

        (semver.inc as Mock).mockReset();
        if (type === BumpType.BETA && prerelease[0] === 'beta') {
          vi.mocked(semver.inc).mockReturnValueOnce('1.0.0-beta.2');
        } else {
          vi.mocked(semver.inc).mockReturnValueOnce(expected);
        }

        const result = await generatePublishManifest(packages, {
          bumpType: type,
        });
        expect(result.manifests[0].newVersion).toBe(expected);
      });
    });

    it('should throw error for invalid version format', async () => {
      const packages = new Set([
        {
          packageJson: { version: 'invalid' },
        } as any,
      ]);

      vi.mocked(semver.parse).mockReturnValueOnce(null);

      await expect(
        generatePublishManifest(packages, { bumpType: BumpType.PATCH }),
      ).rejects.toThrow('Invalid current version');
    });
  });
});
