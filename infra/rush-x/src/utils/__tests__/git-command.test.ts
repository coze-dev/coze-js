import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  ensureNotUncommittedChanges,
  getChangedFiles,
  getChangedFilesFromCached,
} from '../git-command';
import { exec } from '../exec';

// Mock exec utility
vi.mock('../exec', () => ({
  exec: vi.fn(),
}));

describe('git-command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getChangedFilesFromCached', () => {
    it('should return array of changed files', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: 'file1.ts\nfile2.js\nfile3.json\n',
        stderr: '',
      });

      const result = await getChangedFilesFromCached();

      expect(result).toEqual(['file1.ts', 'file2.js', 'file3.json']);
      expect(exec).toHaveBeenCalledWith(
        'git diff --name-only --diff-filter=ACMR --cached',
      );
    });

    it('should handle empty output', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: '',
        stderr: '',
      });

      const result = await getChangedFilesFromCached();

      expect(result).toEqual([]);
      expect(exec).toHaveBeenCalledWith(
        'git diff --name-only --diff-filter=ACMR --cached',
      );
    });

    it('should handle output with empty lines', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: 'file1.ts\n\nfile2.js\n\n\nfile3.json\n',
        stderr: '',
      });

      const result = await getChangedFilesFromCached();

      expect(result).toEqual(['file1.ts', 'file2.js', 'file3.json']);
    });

    it('should handle output with whitespace', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: '  file1.ts  \n  file2.js\nfile3.json  \n',
        stderr: '',
      });

      const result = await getChangedFilesFromCached();

      expect(result).toEqual(['file1.ts', 'file2.js', 'file3.json']);
    });

    it('should filter out empty strings after trimming', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: 'file1.ts\n   \n  \nfile2.js\n',
        stderr: '',
      });

      const result = await getChangedFilesFromCached();

      expect(result).toEqual(['file1.ts', 'file2.js']);
    });
  });

  describe('getChangedFiles', () => {
    it('should return array of changed files', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: 'file1.ts\nfile2.js\nfile3.json\n',
        stderr: '',
      });

      const result = await getChangedFiles();

      expect(result).toEqual(['file1.ts', 'file2.js', 'file3.json']);
    });
  });

  describe('ensureNotUncommittedChanges', () => {
    it('should throw error if there are uncommitted changes', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: 'file1.ts\nfile2.js\nfile3.json\n',
        stderr: '',
      });

      await expect(ensureNotUncommittedChanges()).rejects.toThrow(
        'There are uncommitted changes in the working tree, please commit them first.',
      );
    });

    it('should return true if there are no uncommitted changes', async () => {
      vi.mocked(exec).mockResolvedValue({
        stdout: '',
        stderr: '',
        code: 0,
      });

      const result = await ensureNotUncommittedChanges();

      expect(result).toBe(true);
    });
  });
});
