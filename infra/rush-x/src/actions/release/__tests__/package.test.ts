import path from 'path';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';
import { readJsonFile, writeJsonFile } from '@coze-infra/fs-enhance';

import { applyPublishConfig } from '../package';
import { getRushConfiguration } from '../../../utils/project-analyzer';

// Mock dependencies
vi.mock('path');
vi.mock('@coze-infra/fs-enhance');
vi.mock('../../../utils/project-analyzer');

describe('package', () => {
  const mockProjectFolder = '/mock/project';
  const mockPackageJsonPath = '/mock/project/package.json';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(path.join).mockReturnValue(mockPackageJsonPath);
    vi.mocked(getRushConfiguration).mockReturnValue({
      getProjectByName: vi.fn(),
    } as any);
  });

  describe('applyPublishConfig', () => {
    const mockProject: RushConfigurationProject = {
      projectFolder: mockProjectFolder,
      packageName: 'test-package',
    } as any;

    it('should update workspace dependencies versions', async () => {
      const mockPackageJson = {
        dependencies: {
          'dep-1': 'workspace:^1.0.0',
          'dep-2': '^2.0.0',
          'dep-3': 'workspace:^3.0.0',
        },
      };

      const mockDep1Project = {
        packageJson: { version: '1.1.0' },
      };

      const mockDep3Project = {
        packageJson: { version: '3.1.0' },
      };

      const mockProjects: Record<string, typeof mockDep1Project> = {
        'dep-1': mockDep1Project,
        'dep-3': mockDep3Project,
      };

      vi.mocked(readJsonFile).mockResolvedValue(mockPackageJson);
      vi.mocked(getRushConfiguration).mockReturnValue({
        getProjectByName: vi.fn((name: string) => mockProjects[name] as any),
      } as any);

      await applyPublishConfig(mockProject);

      expect(writeJsonFile).toHaveBeenCalledWith(mockPackageJsonPath, {
        dependencies: {
          'dep-1': '1.1.0',
          'dep-2': '^2.0.0',
          'dep-3': '3.1.0',
        },
      });
    });

    it('should apply cozePublishConfig', async () => {
      const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
        cozePublishConfig: {
          main: './dist/index.js',
          types: './dist/index.d.ts',
          files: ['dist'],
        },
      };

      vi.mocked(readJsonFile).mockResolvedValue(mockPackageJson);

      await applyPublishConfig(mockProject);

      expect(writeJsonFile).toHaveBeenCalledWith(mockPackageJsonPath, {
        name: 'test-package',
        version: '1.0.0',
        main: './dist/index.js',
        types: './dist/index.d.ts',
        files: ['dist'],
        cozePublishConfig: {
          main: './dist/index.js',
          types: './dist/index.d.ts',
          files: ['dist'],
        },
      });
    });

    it('should handle package without dependencies or cozePublishConfig', async () => {
      const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
      };

      vi.mocked(readJsonFile).mockResolvedValue(mockPackageJson);

      await applyPublishConfig(mockProject);

      expect(writeJsonFile).toHaveBeenCalledWith(
        mockPackageJsonPath,
        mockPackageJson,
      );
    });

    it('should handle empty dependencies', async () => {
      const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
        dependencies: {},
      };

      vi.mocked(readJsonFile).mockResolvedValue(mockPackageJson);

      await applyPublishConfig(mockProject);

      expect(writeJsonFile).toHaveBeenCalledWith(
        mockPackageJsonPath,
        mockPackageJson,
      );
    });
  });
});
