import path from 'path';

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import { amendCommit } from '../amend-commit';
import * as projectAnalyzer from '../../../utils/project-analyzer';
import * as gitCommand from '../../../utils/git-command';
import { exec } from '../../../utils/exec';

// Mock all dependencies
vi.mock('path', () => ({ default: { relative: vi.fn() } }));
vi.mock('../../../utils/git-command');
vi.mock('../../../utils/project-analyzer');
vi.mock('../../../utils/exec', () => ({
  exec: vi.fn(),
}));

describe('amendCommit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should amend commit when changes file is detected', async () => {
    // Mock rush configuration
    const mockRushConfig = {
      rushJsonFolder: '/root/path',
      changesFolder: '/root/path/common/changes',
    };
    vi.mocked(projectAnalyzer.getRushConfiguration).mockReturnValue(
      mockRushConfig as any,
    );

    // Mock path.relative to return the changes folder path
    (path.relative as Mock).mockReturnValue('common/changes');

    // Mock git changed files to include a changes file
    vi.mocked(gitCommand.getChangedFilesFromCached).mockResolvedValue([
      'common/changes/my-package.json',
      'some/other/file.js',
    ]);

    await amendCommit();

    // Verify the correct paths were used
    expect(path.relative).toHaveBeenCalledWith(
      '/root/path',
      '/root/path/common/changes',
    );

    // Verify git command was executed
    expect(exec).toHaveBeenCalledWith('git commit --amend --no-edit -n');
  });

  it('should not amend commit when no changes file is detected', async () => {
    // Mock rush configuration
    const mockRushConfig = {
      rushJsonFolder: '/root/path',
      changesFolder: '/root/path/common/changes',
    };
    vi.mocked(projectAnalyzer.getRushConfiguration).mockReturnValue(
      mockRushConfig as any,
    );

    // Mock path.relative to return the changes folder path
    vi.mocked(path.relative).mockReturnValue('common/changes');

    // Mock git changed files to not include any changes file
    vi.mocked(gitCommand.getChangedFilesFromCached).mockResolvedValue([
      'src/index.ts',
      'package.json',
    ]);

    await amendCommit();

    // Verify path.relative was still called
    expect(path.relative).toHaveBeenCalledWith(
      '/root/path',
      '/root/path/common/changes',
    );

    // Verify git command was not executed
    expect(exec).not.toHaveBeenCalled();
  });

  it('should handle empty changed files array', async () => {
    // Mock rush configuration
    const mockRushConfig = {
      rushJsonFolder: '/root/path',
      changesFolder: '/root/path/common/changes',
    };
    vi.mocked(projectAnalyzer.getRushConfiguration).mockReturnValue(
      mockRushConfig as any,
    );

    // Mock path.relative
    vi.mocked(path.relative).mockReturnValue('common/changes');

    // Mock git changed files to return empty array
    vi.mocked(gitCommand.getChangedFilesFromCached).mockResolvedValue([]);

    await amendCommit();

    // Verify path.relative was called
    expect(path.relative).toHaveBeenCalledWith(
      '/root/path',
      '/root/path/common/changes',
    );

    // Verify git command was not executed
    expect(exec).not.toHaveBeenCalled();
  });
});
