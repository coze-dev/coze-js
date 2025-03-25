import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getPackagesToPublish } from '../git';
import { exec } from '../../../utils/exec';

// Mock dependencies
vi.mock('../../../utils/exec');

describe('git', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(exec).mockResolvedValue({ stdout: '', stderr: '', code: 0 });
  });

  describe('getPackagesToPublish', () => {
    it('should parse package tags correctly', async () => {
      const mockTags = [
        'v/package-a@1.0.0',
        'v/package-b@2.0.0',
        'v/@scope/package-c@3.0.0',
        'some-other-tag',
        '',
      ].join('\n');

      vi.mocked(exec).mockResolvedValueOnce({
        stdout: mockTags,
        stderr: '',
        code: 0,
      });

      const result = await getPackagesToPublish('abc123');

      expect(exec).toHaveBeenCalledWith('git tag --points-at abc123');
      expect(result).toEqual([
        { packageName: 'package-a', version: '1.0.0' },
        { packageName: 'package-b', version: '2.0.0' },
        { packageName: '@scope/package-c', version: '3.0.0' },
      ]);
    });

    it('should handle empty tag list', async () => {
      vi.mocked(exec).mockResolvedValueOnce({
        stdout: '',
        stderr: '',
        code: 0,
      });

      const result = await getPackagesToPublish('abc123');

      expect(result).toEqual([]);
    });

    it('should handle tags without version pattern', async () => {
      const mockTags = ['tag1', 'tag2', 'v/invalid-tag', ''].join('\n');

      vi.mocked(exec).mockResolvedValueOnce({
        stdout: mockTags,
        stderr: '',
        code: 0,
      });

      const result = await getPackagesToPublish('abc123');

      expect(result).toEqual([]);
    });

    it('should handle mixed valid and invalid tags', async () => {
      const mockTags = [
        'v/package-a@1.0.0',
        'invalid-tag',
        'v/package-b@2.0.0',
        'v/invalid-format',
        '',
      ].join('\n');

      vi.mocked(exec).mockResolvedValueOnce({
        stdout: mockTags,
        stderr: '',
        code: 0,
      });

      const result = await getPackagesToPublish('abc123');

      expect(result).toEqual([
        { packageName: 'package-a', version: '1.0.0' },
        { packageName: 'package-b', version: '2.0.0' },
      ]);
    });
  });
});
