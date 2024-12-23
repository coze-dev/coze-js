import { describe, it, expect, vi, beforeEach } from 'vitest';
import { confirm } from '@inquirer/prompts';

import { type PublishManifest } from '../types';
import { confirmForPublish } from '../confirm';

// Mock dependencies
vi.mock('@inquirer/prompts');
vi.mock('chalk', () => ({
  default: {
    gray: vi.fn((str: string) => `gray(${str})`),
    bgGreen: vi.fn((str: string) => `bgGreen(${str})`),
    bold: vi.fn((str: string) => `bold(${str})`),
  },
}));

describe('confirm', () => {
  const mockPublishManifests: PublishManifest[] = [
    {
      project: {
        packageName: 'test-package-1',
      } as any,
      currentVersion: '1.0.0',
      newVersion: '1.1.0',
    },
    {
      project: {
        packageName: 'test-package-2',
      } as any,
      currentVersion: '2.0.0',
      newVersion: '2.1.0',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(vi.fn());
    vi.mocked(confirm).mockResolvedValue(true);
  });

  describe('confirmForPublish', () => {
    it('should display package information correctly', async () => {
      await confirmForPublish(mockPublishManifests, false);

      expect(console.log).toHaveBeenCalledWith(
        'gray(Will publish the following packages:)',
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(
          'test-package-1: bgGreen(1.0.0 -> bold(1.1.0))',
        ),
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(
          'test-package-2: bgGreen(2.0.0 -> bold(2.1.0))',
        ),
      );
    });

    it('should display empty line before confirmation prompt', async () => {
      await confirmForPublish(mockPublishManifests, false);
      expect(console.log).toHaveBeenCalledWith('\n');
    });

    it('should return false when dry run is true', async () => {
      const result = await confirmForPublish(mockPublishManifests, true);
      expect(result).toBe(false);
      expect(confirm).not.toHaveBeenCalled();
    });

    it('should return true when user confirms', async () => {
      vi.mocked(confirm).mockResolvedValueOnce(true);
      const result = await confirmForPublish(mockPublishManifests, false);
      expect(result).toBe(true);
      expect(confirm).toHaveBeenCalledWith({
        message: 'Are you sure to publish?',
        default: true,
      });
    });

    it('should return false when user cancels', async () => {
      vi.mocked(confirm).mockResolvedValueOnce(false);
      const result = await confirmForPublish(mockPublishManifests, false);
      expect(result).toBe(false);
    });

    it('should return false when confirmation throws error', async () => {
      vi.mocked(confirm).mockRejectedValueOnce(new Error('User cancelled'));
      const result = await confirmForPublish(mockPublishManifests, false);
      expect(result).toBe(false);
    });

    it('should handle empty manifest list', async () => {
      await confirmForPublish([], false);
      expect(console.log).toHaveBeenCalledWith(
        'gray(Will publish the following packages:)',
      );
      expect(console.log).toHaveBeenCalledTimes(2); // 标题 + 空行
    });

    it('should format version changes with correct styling', async () => {
      const singleManifest: PublishManifest[] = [
        {
          project: {
            packageName: 'test-package',
          } as any,
          currentVersion: '1.0.0',
          newVersion: '2.0.0',
        },
      ];

      await confirmForPublish(singleManifest, false);

      // 验证 chalk 样式的正确应用顺序
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(
          '- test-package: bgGreen(1.0.0 -> bold(2.0.0))',
        ),
      );
    });

    it('should handle scoped package names', async () => {
      const scopedManifest: PublishManifest[] = [
        {
          project: {
            packageName: '@scope/package',
          } as any,
          currentVersion: '1.0.0',
          newVersion: '1.1.0',
        },
      ];

      await confirmForPublish(scopedManifest, false);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining(
          '- @scope/package: bgGreen(1.0.0 -> bold(1.1.0))',
        ),
      );
    });
  });
});
