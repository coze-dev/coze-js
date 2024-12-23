import { describe, it, expect, vi, beforeEach } from 'vitest';

import { type PackageToPublish } from '../types';
import { buildReleaseManifest } from '../manifest';
import { getRushConfiguration } from '../../../utils/project-analyzer';

// Mock dependencies
vi.mock('../../../utils/project-analyzer');

describe('manifest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('buildReleaseManifest', () => {
    it('should build release manifest for valid packages', () => {
      const mockPackages: PackageToPublish[] = [
        { packageName: 'package-a', version: '1.0.0' },
        { packageName: 'package-b', version: '2.0.0' },
      ];

      const mockProjects = {
        'package-a': {
          packageName: 'package-a',
          packageJson: { version: '1.0.0' },
        },
        'package-b': {
          packageName: 'package-b',
          packageJson: { version: '2.0.0' },
        },
      };

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: vi.fn(
          (name: string) => mockProjects[name as keyof typeof mockProjects],
        ),
      } as any);

      const result = buildReleaseManifest(mockPackages);

      expect(result).toEqual([
        {
          project: mockProjects['package-a'],
          version: '1.0.0',
        },
        {
          project: mockProjects['package-b'],
          version: '2.0.0',
        },
      ]);
    });

    it('should throw error for non-existent package', () => {
      const mockPackages: PackageToPublish[] = [
        { packageName: 'non-existent-package', version: '1.0.0' },
      ];

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: vi.fn(() => null),
      } as any);

      expect(() => buildReleaseManifest(mockPackages)).toThrow(
        'Cannot find project: non-existent-package',
      );
    });

    it('should handle empty package list', () => {
      const result = buildReleaseManifest([]);
      expect(result).toEqual([]);
    });

    it('should handle scoped packages', () => {
      const mockPackages: PackageToPublish[] = [
        { packageName: '@scope/package-a', version: '1.0.0' },
      ];

      const mockProjects = {
        '@scope/package-a': {
          packageName: '@scope/package-a',
          packageJson: { version: '1.0.0' },
        },
      } as const;

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: vi.fn(
          (name: string) => mockProjects[name as keyof typeof mockProjects],
        ),
      } as any);

      const result = buildReleaseManifest(mockPackages);

      expect(result).toEqual([
        {
          project: mockProjects['@scope/package-a'],
          version: '1.0.0',
        },
      ]);
    });
  });
});
