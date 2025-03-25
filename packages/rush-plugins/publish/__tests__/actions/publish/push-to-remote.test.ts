import { describe, it, expect, vi, beforeEach } from 'vitest';
import dayjs from 'dayjs';
import { logger } from '@coze-infra/rush-logger';

import { BumpType } from '../types';
import { pushToRemote } from '../push-to-remote';
import { commitChanges, push } from '../git';
import { getCurrentBranchName } from '../../../utils/git-command';
import { exec } from '../../../utils/exec';

// Mock dependencies
vi.mock('dayjs');
vi.mock('@coze-infra/rush-logger');
vi.mock('../../../utils/git-command');
vi.mock('../../../utils/exec');
vi.mock('../git');
vi.mock('open', () => ({
  default: vi.fn(),
}));

describe('push-to-remote', () => {
  const mockCwd = '/mock/cwd';
  const mockSessionId = 'test-session';
  const mockDate = '20240101';
  const mockBranchName = 'feature/test';
  const mockChangedFiles = ['package.json', 'CHANGELOG.md'];
  const mockPublishManifests = [
    {
      project: {
        packageName: 'test-package',
      },
      currentVersion: '1.0.0',
      newVersion: '1.1.0',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dayjs).mockReturnValue({ format: () => mockDate } as any);
    vi.mocked(getCurrentBranchName).mockResolvedValue(mockBranchName);
    vi.mocked(exec).mockResolvedValue({ stdout: '', stderr: '', code: 0 });
    vi.mocked(commitChanges).mockResolvedValue({
      effects: ['tag1', 'branch1'],
      branchName: mockBranchName,
    });
  });

  describe('pushToRemote', () => {
    it('should skip commit and push when skipCommit is true', async () => {
      await pushToRemote({
        sessionId: mockSessionId,
        changedFiles: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        bumpPolicy: BumpType.PATCH,
        skipCommit: true,
        skipPush: false,
      });

      expect(exec).not.toHaveBeenCalled();
      expect(commitChanges).not.toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });

    it('should use existing branch for beta releases', async () => {
      await pushToRemote({
        sessionId: mockSessionId,
        changedFiles: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        bumpPolicy: BumpType.BETA,
        skipCommit: false,
        skipPush: false,
      });

      expect(getCurrentBranchName).toHaveBeenCalled();
      expect(exec).not.toHaveBeenCalled(); // 不应该创建新分支
      expect(commitChanges).toHaveBeenCalledWith({
        sessionId: mockSessionId,
        files: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        branchName: mockBranchName,
      });
      expect(push).toHaveBeenCalledWith(['tag1', 'branch1'], mockCwd);
    });

    it('should create new branch for non-beta releases', async () => {
      await pushToRemote({
        sessionId: mockSessionId,
        changedFiles: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        bumpPolicy: BumpType.PATCH,
        skipCommit: false,
        skipPush: false,
      });

      const expectedBranchName = `release/${mockDate}-${mockSessionId}`;
      expect(exec).toHaveBeenCalledWith(
        `git checkout -b ${expectedBranchName}`,
        {
          cwd: mockCwd,
        },
      );
      expect(commitChanges).toHaveBeenCalledWith({
        sessionId: mockSessionId,
        files: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        branchName: expectedBranchName,
      });
      expect(push).toHaveBeenCalledWith(['tag1', 'branch1'], mockCwd);
    });

    it('should skip push when skipPush is true', async () => {
      await pushToRemote({
        sessionId: mockSessionId,
        changedFiles: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        bumpPolicy: BumpType.PATCH,
        skipCommit: false,
        skipPush: true,
      });

      expect(commitChanges).toHaveBeenCalled();
      expect(push).not.toHaveBeenCalled();
    });

    it('should show GitHub Actions link for test releases', async () => {
      await pushToRemote({
        sessionId: mockSessionId,
        changedFiles: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        bumpPolicy: BumpType.ALPHA,
        skipCommit: false,
        skipPush: false,
      });

      expect(logger.success).toHaveBeenCalledWith(
        'Please refer to https://github.com/coze-dev/coze-js/actions/workflows/release.yml for the release progress.',
      );
    });

    it('should show PR link and open browser for production releases', async () => {
      const open = await import('open');
      const expectedBranchName = `release/${mockDate}-${mockSessionId}`;
      const expectedPrUrl = `https://github.com/coze-dev/coze-js/compare/${expectedBranchName}?expand=1`;

      await pushToRemote({
        sessionId: mockSessionId,
        changedFiles: mockChangedFiles,
        cwd: mockCwd,
        publishManifests: mockPublishManifests,
        bumpPolicy: BumpType.PATCH,
        skipCommit: false,
        skipPush: false,
      });

      expect(logger.success).toHaveBeenCalledWith(
        expect.stringContaining(expectedPrUrl),
        false,
      );
      expect(open.default).toHaveBeenCalledWith(expectedPrUrl);
    });
  });
});
