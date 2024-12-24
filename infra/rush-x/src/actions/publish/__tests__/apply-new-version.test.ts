import { describe, it, expect, vi, beforeEach } from 'vitest';
import { type RushConfigurationProject } from '@rushstack/rush-sdk';
import { logger } from '@coze-infra/rush-logger';
import { readJsonFile, writeJsonFile } from '@coze-infra/fs-enhance';

import { type PublishManifest } from '../types';
import { applyPublishManifest } from '../apply-new-version';

// Mock dependencies
vi.mock('@coze-infra/rush-logger');
vi.mock('@coze-infra/fs-enhance');
vi.mock('path', () => ({
  default: { resolve: (...args: string[]) => args.join('/') },
}));

describe('apply-new-version', () => {
  const mockProjectFolder = '/mock/project';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('applyPublishManifest', () => {
    it('should update version in package.json for a single package', async () => {
      const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
      };

      const mockProject: RushConfigurationProject = {
        packageName: 'test-package',
        projectFolder: mockProjectFolder,
      } as any;

      const manifest: PublishManifest = {
        project: mockProject,
        currentVersion: '1.0.0',
        newVersion: '1.1.0',
      };

      vi.mocked(readJsonFile).mockResolvedValue(mockPackageJson);

      const result = await applyPublishManifest([manifest]);

      // 验证文件读写操作
      expect(readJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/package.json`,
      );
      expect(writeJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/package.json`,
        {
          ...mockPackageJson,
          version: '1.1.0',
        },
      );

      // 验证日志输出
      expect(logger.info).toHaveBeenCalledWith(
        'Updated version for packages: test-package',
      );

      // 验证返回的修改文件列表
      expect(result).toEqual([`${mockProjectFolder}/package.json`]);
    });

    it('should update version in package.json for multiple packages', async () => {
      const mockPackageJson1 = {
        name: 'package-1',
        version: '1.0.0',
      };

      const mockPackageJson2 = {
        name: 'package-2',
        version: '2.0.0',
      };

      const mockProject1: RushConfigurationProject = {
        packageName: 'package-1',
        projectFolder: `${mockProjectFolder}/package-1`,
      } as any;

      const mockProject2: RushConfigurationProject = {
        packageName: 'package-2',
        projectFolder: `${mockProjectFolder}/package-2`,
      } as any;

      const manifests: PublishManifest[] = [
        {
          project: mockProject1,
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
        },
        {
          project: mockProject2,
          currentVersion: '2.0.0',
          newVersion: '2.1.0',
        },
      ];

      vi.mocked(readJsonFile).mockImplementation((filePath: string) => {
        if (filePath.includes('package-1')) {
          return Promise.resolve(mockPackageJson1);
        }
        if (filePath.includes('package-2')) {
          return Promise.resolve(mockPackageJson2);
        }
        return Promise.reject(new Error('Unexpected file read'));
      });

      const result = await applyPublishManifest(manifests);

      // 验证文件读写操作
      expect(readJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/package-1/package.json`,
      );
      expect(readJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/package-2/package.json`,
      );

      expect(writeJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/package-1/package.json`,
        {
          ...mockPackageJson1,
          version: '1.1.0',
        },
      );
      expect(writeJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/package-2/package.json`,
        {
          ...mockPackageJson2,
          version: '2.1.0',
        },
      );

      // 验证日志输出
      expect(logger.info).toHaveBeenCalledWith(
        'Updated version for packages: package-1, package-2',
      );

      // 验证返回的修改文件列表
      expect(result).toEqual([
        `${mockProjectFolder}/package-1/package.json`,
        `${mockProjectFolder}/package-2/package.json`,
      ]);
    });

    it('should handle read error gracefully', async () => {
      const mockProject: RushConfigurationProject = {
        packageName: 'test-package',
        projectFolder: mockProjectFolder,
      } as any;

      const manifest: PublishManifest = {
        project: mockProject,
        currentVersion: '1.0.0',
        newVersion: '1.1.0',
      };

      vi.mocked(readJsonFile).mockRejectedValue(new Error('File read error'));

      await expect(applyPublishManifest([manifest])).rejects.toThrow(
        'File read error',
      );
      expect(writeJsonFile).not.toHaveBeenCalled();
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should handle write error gracefully', async () => {
      const mockPackageJson = {
        name: 'test-package',
        version: '1.0.0',
      };

      const mockProject: RushConfigurationProject = {
        packageName: 'test-package',
        projectFolder: mockProjectFolder,
      } as any;

      const manifest: PublishManifest = {
        project: mockProject,
        currentVersion: '1.0.0',
        newVersion: '1.1.0',
      };

      vi.mocked(readJsonFile).mockResolvedValue(mockPackageJson);
      vi.mocked(writeJsonFile).mockRejectedValue(new Error('File write error'));

      await expect(applyPublishManifest([manifest])).rejects.toThrow(
        'File write error',
      );
      expect(logger.info).not.toHaveBeenCalled();
    });

    it('should handle empty manifest list', async () => {
      const result = await applyPublishManifest([]);

      expect(readJsonFile).not.toHaveBeenCalled();
      expect(writeJsonFile).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'Updated version for packages: ',
      );
      expect(result).toEqual([]);
    });
  });
});
