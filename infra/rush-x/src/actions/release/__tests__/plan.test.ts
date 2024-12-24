import { describe, it, expect } from 'vitest';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';

import { type ReleaseManifest } from '../types';
import { checkReleasePlan, calReleaseType, ReleaseType } from '../plan';

describe('plan', () => {
  const createMockProject = (name: string): RushConfigurationProject => {
    const project = {
      packageName: name,
      projectFolder: `/mock/project/${name}`,
      _shouldPublish: true,
      _versionPolicy: null,
      _dependencyProjects: new Set<RushConfigurationProject>(),
      _consumingProjects: new Set<RushConfigurationProject>(),
      _packageJson: {},
      projectRelativeFolder: `packages/${name}`,
      projectRushConfigFolder: '/mock/rush/config',
      projectRushTempFolder: '/mock/rush/temp',
      tempProjectName: name,
      unscopedTempProjectName: name,
      skipRushCheck: false,
      publishFolder: `/mock/project/${name}/dist`,
      isMainProject: false,
      dependencyProjects: new Set<RushConfigurationProject>(),
      consumingProjects: new Set<RushConfigurationProject>(),
      shouldPublish: true,
      versionPolicyName: undefined,
      decoupledLocalDependencies: [],
      rushConfiguration: {} as any,
      reviewCategory: undefined,
      packageJsonEditor: {} as any,
      isPublished: true,
      statusValue: 0,
      statusMessage: '',
      cyclicDependencyProjects: new Set<RushConfigurationProject>(),
      localDependencyProjects: new Set<RushConfigurationProject>(),
      tags: [],
    } as unknown as RushConfigurationProject;
    return project;
  };

  describe('calReleaseType', () => {
    it('should identify alpha versions', () => {
      expect(calReleaseType('1.0.0-alpha.1')).toBe(ReleaseType.ALPHA);
      expect(calReleaseType('2.0.0-alpha.0')).toBe(ReleaseType.ALPHA);
      expect(calReleaseType('0.1.0-alpha.5')).toBe(ReleaseType.ALPHA);
    });

    it('should identify beta versions', () => {
      expect(calReleaseType('1.0.0-beta.1')).toBe(ReleaseType.BETA);
      expect(calReleaseType('2.0.0-beta.0')).toBe(ReleaseType.BETA);
      expect(calReleaseType('0.1.0-beta.5')).toBe(ReleaseType.BETA);
    });

    it('should identify latest versions', () => {
      expect(calReleaseType('1.0.0')).toBe(ReleaseType.LATEST);
      expect(calReleaseType('2.0.0')).toBe(ReleaseType.LATEST);
      expect(calReleaseType('0.1.0')).toBe(ReleaseType.LATEST);
    });
  });

  describe('checkReleasePlan', () => {
    const mockProject1 = createMockProject('package-1');
    const mockProject2 = createMockProject('package-2');

    it('should allow alpha releases on any branch', () => {
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject1,
          version: '1.0.0-alpha.1',
        },
        {
          project: mockProject2,
          version: '2.0.0-alpha.1',
        },
      ];

      expect(() =>
        checkReleasePlan(releaseManifests, 'feature/test'),
      ).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'main')).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'develop')).not.toThrow();
    });

    it('should allow beta releases on any branch', () => {
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject1,
          version: '1.0.0-beta.1',
        },
        {
          project: mockProject2,
          version: '2.0.0-beta.1',
        },
      ];

      expect(() =>
        checkReleasePlan(releaseManifests, 'feature/test'),
      ).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'main')).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'develop')).not.toThrow();
    });

    it('should only allow latest releases on main branch', () => {
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject1,
          version: '1.0.0',
        },
        {
          project: mockProject2,
          version: '2.0.0',
        },
      ];

      expect(() => checkReleasePlan(releaseManifests, 'main')).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'feature/test')).toThrow(
        'For LATEST release, should be on main branch only.',
      );
      expect(() => checkReleasePlan(releaseManifests, 'develop')).toThrow(
        'For LATEST release, should be on main branch only.',
      );
    });

    it('should treat mixed versions as latest release', () => {
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject1,
          version: '1.0.0', // latest
        },
        {
          project: mockProject2,
          version: '2.0.0-beta.1', // beta
        },
      ];

      expect(() => checkReleasePlan(releaseManifests, 'main')).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'feature/test')).toThrow(
        'For LATEST release, should be on main branch only.',
      );
    });

    it('should treat mixed alpha/beta versions as beta release', () => {
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject1,
          version: '1.0.0-alpha.1', // alpha
        },
        {
          project: mockProject2,
          version: '2.0.0-beta.1', // beta
        },
      ];

      expect(() =>
        checkReleasePlan(releaseManifests, 'feature/test'),
      ).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'main')).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'develop')).not.toThrow();
    });

    it('should handle empty release manifests', () => {
      expect(() => checkReleasePlan([], 'main')).not.toThrow();
      expect(() => checkReleasePlan([], 'feature/test')).not.toThrow();
    });

    it('should handle single package release', () => {
      const releaseManifests: ReleaseManifest[] = [
        {
          project: mockProject1,
          version: '1.0.0',
        },
      ];

      expect(() => checkReleasePlan(releaseManifests, 'main')).not.toThrow();
      expect(() => checkReleasePlan(releaseManifests, 'feature/test')).toThrow(
        'For LATEST release, should be on main branch only.',
      );
    });
  });
});
