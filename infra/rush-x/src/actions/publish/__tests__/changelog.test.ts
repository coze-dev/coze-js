import fs from 'fs/promises';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  readJsonFile,
  writeJsonFile,
  isFileExists,
  isDirExists,
} from '@coze-infra/fs-enhance';

import { type PublishManifest } from '../types';
import { generateChangelog } from '../changelog';
import { getRushConfiguration } from '../../../utils/project-analyzer';
import {
  generateChangelog as core,
  type ChangeFile,
  type ChangeLog,
} from '../../../generate-changelog/generate-changelog';

// Mock dependencies
vi.mock('fs/promises');
vi.mock('@coze-infra/fs-enhance');
vi.mock('../../../utils/project-analyzer');
vi.mock('../../../generate-changelog/generate-changelog');
vi.mock('path', () => ({
  default: {
    resolve: (...args: string[]) => args.join('/'),
  },
}));

describe('changelog', () => {
  const mockChangesFolder = '/mock/changes';
  const mockProjectFolder = '/mock/project';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getRushConfiguration).mockReturnValue({
      changesFolder: mockChangesFolder,
    } as any);
  });

  describe('generateChangelog', () => {
    const mockChangeFile: ChangeFile = {
      changes: [
        {
          type: 'minor',
          comment: 'Test change',
          packageName: 'test-package',
        },
      ],
      packageName: 'test-package',
      email: 'test@example.com',
    };

    const mockPreviousChangelog: ChangeLog = {
      name: 'test-package',
      entries: [
        {
          version: '1.0.0',
          tag: 'test-package_v1.0.0',
          date: '2024-01-01',
          comments: {
            minor: [{ comment: 'Previous change' }],
          },
        },
      ],
    };

    const mockNewChangelog: ChangeLog = {
      name: 'test-package',
      entries: [
        {
          version: '1.1.0',
          tag: 'test-package_v1.1.0',
          date: '2024-01-02',
          comments: {
            minor: [{ comment: 'Test change' }],
          },
        },
        ...mockPreviousChangelog.entries,
      ],
    };

    const mockChangelogMarkdown = '# Changelog\n\n## 1.1.0\n\n- Test change';

    it('should generate changelog for a package with changes', async () => {
      // Mock file system operations
      vi.mocked(isDirExists).mockResolvedValue(true);
      vi.mocked(fs.readdir).mockResolvedValue(['change1.json'] as any);
      vi.mocked(readJsonFile).mockImplementation((filePath: string) => {
        if (filePath.endsWith('change1.json')) {
          return Promise.resolve(mockChangeFile);
        }
        if (filePath.endsWith('CHANGELOG.json')) {
          return Promise.resolve(mockPreviousChangelog);
        }
        return Promise.reject(new Error('Unexpected file read'));
      });
      vi.mocked(isFileExists).mockResolvedValue(true);
      vi.mocked(core).mockResolvedValue({
        changelog: mockNewChangelog,
        report: mockChangelogMarkdown,
      });

      const manifest: PublishManifest = {
        project: {
          packageName: 'test-package',
          projectFolder: mockProjectFolder,
        } as any,
        currentVersion: '1.0.0',
        newVersion: '1.1.0',
      };

      const result = await generateChangelog([manifest]);

      // Verify file operations
      expect(writeJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/CHANGELOG.json`,
        mockNewChangelog,
      );
      expect(fs.writeFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/CHANGELOG.md`,
        mockChangelogMarkdown,
      );
      expect(fs.unlink).toHaveBeenCalledWith(
        `${mockChangesFolder}/test-package/change1.json`,
      );

      // Verify returned file paths
      expect(result).toEqual([
        `${mockProjectFolder}/CHANGELOG.json`,
        `${mockProjectFolder}/CHANGELOG.md`,
        `${mockChangesFolder}/test-package/change1.json`,
      ]);
    });

    it('should handle package without changes directory', async () => {
      vi.mocked(isDirExists).mockResolvedValue(false);
      vi.mocked(isFileExists).mockResolvedValue(false);
      vi.mocked(core).mockResolvedValue({
        changelog: { name: 'test-package', entries: [] },
        report: '# Changelog\n',
      });

      const manifest: PublishManifest = {
        project: {
          packageName: 'test-package',
          projectFolder: mockProjectFolder,
        } as any,
        currentVersion: '1.0.0',
        newVersion: '1.1.0',
      };

      const result = await generateChangelog([manifest]);

      expect(fs.readdir).not.toHaveBeenCalled();
      expect(result).toEqual([
        `${mockProjectFolder}/CHANGELOG.json`,
        `${mockProjectFolder}/CHANGELOG.md`,
      ]);
    });

    it('should handle package without existing changelog', async () => {
      vi.mocked(isDirExists).mockResolvedValue(true);
      vi.mocked(fs.readdir).mockResolvedValue(['change1.json'] as any);
      vi.mocked(readJsonFile).mockImplementation((filePath: string) => {
        if (filePath.endsWith('change1.json')) {
          return Promise.resolve(mockChangeFile);
        }
        return Promise.reject(new Error('File not found'));
      });
      vi.mocked(isFileExists).mockResolvedValue(false);
      vi.mocked(core).mockResolvedValue({
        changelog: mockNewChangelog,
        report: mockChangelogMarkdown,
      });

      const manifest: PublishManifest = {
        project: {
          packageName: 'test-package',
          projectFolder: mockProjectFolder,
        } as any,
        currentVersion: '1.0.0',
        newVersion: '1.1.0',
      };

      const result = await generateChangelog([manifest]);

      expect(writeJsonFile).toHaveBeenCalledWith(
        `${mockProjectFolder}/CHANGELOG.json`,
        mockNewChangelog,
      );
      expect(result).toContain(`${mockProjectFolder}/CHANGELOG.json`);
    });

    it('should handle invalid change files', async () => {
      vi.mocked(isDirExists).mockResolvedValue(true);
      vi.mocked(fs.readdir).mockResolvedValue([
        'invalid.json',
        'valid.json',
      ] as any);
      vi.mocked(readJsonFile).mockImplementation((filePath: string) => {
        if (filePath.endsWith('invalid.json')) {
          return Promise.reject(new Error('Invalid JSON'));
        }
        if (filePath.endsWith('valid.json')) {
          return Promise.resolve(mockChangeFile);
        }
        if (filePath.endsWith('CHANGELOG.json')) {
          return Promise.resolve(mockPreviousChangelog);
        }
        return Promise.reject(new Error('Unexpected file read'));
      });
      vi.mocked(isFileExists).mockResolvedValue(true);
      vi.mocked(core).mockResolvedValue({
        changelog: mockNewChangelog,
        report: mockChangelogMarkdown,
      });

      const manifest: PublishManifest = {
        project: {
          packageName: 'test-package',
          projectFolder: mockProjectFolder,
        } as any,
        currentVersion: '1.0.0',
        newVersion: '1.1.0',
      };

      const result = await generateChangelog([manifest]);

      // Should still process valid change file
      expect(core).toHaveBeenCalledWith(
        expect.objectContaining({
          commingChanges: [mockChangeFile],
        }),
      );
      expect(result).toContain(
        `${mockChangesFolder}/test-package/invalid.json`,
      );
      expect(result).toContain(`${mockChangesFolder}/test-package/valid.json`);
    });

    it('should handle multiple packages', async () => {
      vi.mocked(isDirExists).mockResolvedValue(true);
      vi.mocked(fs.readdir).mockResolvedValue(['change1.json'] as any);
      vi.mocked(readJsonFile).mockImplementation((filePath: string) => {
        if (filePath.endsWith('change1.json')) {
          return Promise.resolve(mockChangeFile);
        }
        if (filePath.endsWith('CHANGELOG.json')) {
          return Promise.resolve(mockPreviousChangelog);
        }
        return Promise.reject(new Error('Unexpected file read'));
      });
      vi.mocked(isFileExists).mockResolvedValue(true);
      vi.mocked(core).mockResolvedValue({
        changelog: mockNewChangelog,
        report: mockChangelogMarkdown,
      });

      const manifests: PublishManifest[] = [
        {
          project: {
            packageName: 'package-1',
            projectFolder: `${mockProjectFolder}/package-1`,
          } as any,
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
        },
        {
          project: {
            packageName: 'package-2',
            projectFolder: `${mockProjectFolder}/package-2`,
          } as any,
          currentVersion: '2.0.0',
          newVersion: '2.1.0',
        },
      ];

      const result = await generateChangelog(manifests);

      // Should process both packages
      expect(result).toContain(`${mockProjectFolder}/package-1/CHANGELOG.json`);
      expect(result).toContain(`${mockProjectFolder}/package-1/CHANGELOG.md`);
      expect(result).toContain(`${mockProjectFolder}/package-2/CHANGELOG.json`);
      expect(result).toContain(`${mockProjectFolder}/package-2/CHANGELOG.md`);
    });
  });
});
