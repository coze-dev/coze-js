import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';

import { type PublishOptions } from '../types';
import { validateAndGetPackages } from '../packages';
import { getRushConfiguration } from '../../../utils/project-analyzer';

// Mock dependencies
vi.mock('../../../utils/project-analyzer');

describe('packages', () => {
  // 创建模拟项目
  const createMockProject = ({
    name,
    shouldPublish = true,
    dependencyProjects = new Set<RushConfigurationProject>(),
    consumingProjects = new Set<RushConfigurationProject>(),
  }: {
    name: string;
    shouldPublish?: boolean;
    dependencyProjects?: Set<RushConfigurationProject>;
    consumingProjects?: Set<RushConfigurationProject>;
  }): RushConfigurationProject => {
    const project = {
      packageName: name,
      shouldPublish,
      dependencyProjects,
      consumingProjects,
      _shouldPublish: shouldPublish,
      _versionPolicy: null,
      _dependencyProjects: dependencyProjects,
      _consumingProjects: consumingProjects,
    } as unknown as RushConfigurationProject;
    return project;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('validateAndGetPackages', () => {
    it('should throw error when no packages are specified', () => {
      const options: PublishOptions = {};
      expect(() => validateAndGetPackages(options)).toThrow(
        'No packages to publish',
      );
    });

    it('should throw error when package is not found', () => {
      const options: PublishOptions = {
        to: ['non-existent-package'],
      };

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: () => null,
      } as any);

      expect(() => validateAndGetPackages(options)).toThrow(
        'Package "non-existent-package" not found in rush configuration',
      );
    });

    it('should throw error when package is not set to publish', () => {
      const options: PublishOptions = {
        to: ['non-publishable-package'],
      };

      const mockProject = createMockProject({
        name: 'non-publishable-package',
        shouldPublish: false,
      });
      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: () => mockProject,
      } as any);

      expect(() => validateAndGetPackages(options)).toThrow(
        'Package "non-publishable-package" is not set to publish',
      );
    });

    it('should handle "to" pattern correctly', () => {
      const depProject1 = createMockProject({ name: 'dep1' });
      const depProject2 = createMockProject({ name: 'dep2' });
      const nonPublishableDepProject = createMockProject({
        name: 'dep3',
        shouldPublish: false,
      });
      const mainProject = createMockProject({
        name: 'main',
        dependencyProjects: new Set([
          depProject1,
          depProject2,
          nonPublishableDepProject,
        ]),
      });

      const mockProjects = {
        main: mainProject,
        dep1: depProject1,
        dep2: depProject2,
        dep3: nonPublishableDepProject,
      } as const;

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: (name: string) =>
          mockProjects[name as keyof typeof mockProjects],
      } as any);

      const options: PublishOptions = {
        to: ['main'],
      };

      const result = validateAndGetPackages(options);
      expect(result.size).toBe(3); // main + 2 publishable deps
      expect(result.has(mainProject)).toBe(true);
      expect(result.has(depProject1)).toBe(true);
      expect(result.has(depProject2)).toBe(true);
      expect(result.has(nonPublishableDepProject)).toBe(false);
    });

    it('should handle "from" pattern correctly', () => {
      const depProject = createMockProject({ name: 'dep' });
      const consumingProject1 = createMockProject({ name: 'consuming1' });
      const consumingProject2 = createMockProject({ name: 'consuming2' });
      const nonPublishableConsumer = createMockProject({
        name: 'consuming3',
        shouldPublish: false,
      });

      const mainProject = createMockProject({
        name: 'main',
        dependencyProjects: new Set([depProject]),
        consumingProjects: new Set([
          consumingProject1,
          consumingProject2,
          nonPublishableConsumer,
        ]),
      });

      const mockProjects = {
        main: mainProject,
        dep: depProject,
        consuming1: consumingProject1,
        consuming2: consumingProject2,
        consuming3: nonPublishableConsumer,
      } as const;

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: (name: string) =>
          mockProjects[name as keyof typeof mockProjects],
      } as any);

      const options: PublishOptions = {
        from: ['main'],
      };

      const result = validateAndGetPackages(options);
      expect(result.size).toBe(4); // main + dep + 2 publishable consumers
      expect(result.has(mainProject)).toBe(true);
      expect(result.has(depProject)).toBe(true);
      expect(result.has(consumingProject1)).toBe(true);
      expect(result.has(consumingProject2)).toBe(true);
      expect(result.has(nonPublishableConsumer)).toBe(false);
    });

    it('should handle "only" pattern correctly', () => {
      const project1 = createMockProject({ name: 'project1' });
      const project2 = createMockProject({ name: 'project2' });

      const mockProjects = {
        project1,
        project2,
      } as const;

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: (name: string) =>
          mockProjects[name as keyof typeof mockProjects],
      } as any);

      const options: PublishOptions = {
        only: ['project1', 'project2'],
      };

      const result = validateAndGetPackages(options);
      expect(result.size).toBe(2);
      expect(result.has(project1)).toBe(true);
      expect(result.has(project2)).toBe(true);
    });

    it('should combine multiple patterns correctly', () => {
      const depProject = createMockProject({ name: 'dep' });
      const consumingProject = createMockProject({ name: 'consuming' });
      const onlyProject = createMockProject({ name: 'only' });

      const mainProject = createMockProject({
        name: 'main',
        dependencyProjects: new Set([depProject]),
        consumingProjects: new Set([consumingProject]),
      });

      const mockProjects = {
        main: mainProject,
        dep: depProject,
        consuming: consumingProject,
        only: onlyProject,
      } as const;

      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: (name: string) =>
          mockProjects[name as keyof typeof mockProjects],
      } as any);

      const options: PublishOptions = {
        to: ['main'],
        from: ['main'],
        only: ['only'],
      };

      const result = validateAndGetPackages(options);
      expect(result.size).toBe(4); // main + dep + consuming + only
      expect(result.has(mainProject)).toBe(true);
      expect(result.has(depProject)).toBe(true);
      expect(result.has(consumingProject)).toBe(true);
      expect(result.has(onlyProject)).toBe(true);
    });
  });
});
