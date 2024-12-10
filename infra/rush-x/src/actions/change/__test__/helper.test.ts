import path from 'path';

import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';

import * as helper from '../helper';
import * as projectAnalyzer from '../../../utils/project-analyzer';
import * as gitCommand from '../../../utils/git-command';

// Mock all dependencies
vi.mock('path', () => ({ default: { relative: vi.fn(), dirname: vi.fn() } }));
vi.mock('@rushstack/rush-sdk/lib/api/ChangeFile');
vi.mock('@coze-infra/rush-logger');
vi.mock('../../../utils/project-analyzer');
vi.mock('../../../utils/git-command');
vi.mock('../../../utils/exec');
vi.mock('../../../utils/env');

describe('helper functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('collectShouldUpdateChangesProjects', () => {
    it('should collect projects that need changes update', async () => {
      const mockRushConfig = {
        rushJsonFolder: '/root/path',
        changesFolder: '/root/path/common/changes',
        getProjectLookupForRoot: vi.fn(),
      };

      const mockProject = {
        packageName: 'test-package',
        shouldPublish: true,
      };

      const mockLookup = {
        findChildPath: vi.fn(),
      };

      vi.mocked(projectAnalyzer.getRushConfiguration).mockReturnValue(
        mockRushConfig as any,
      );
      mockRushConfig.getProjectLookupForRoot.mockReturnValue(mockLookup);
      mockLookup.findChildPath.mockReturnValue(mockProject);

      (path.relative as Mock)
        .mockReturnValueOnce('common/changes')
        .mockReturnValueOnce('test-package');

      vi.mocked(gitCommand.getChangedFilesFromCached).mockResolvedValue([
        'packages/test-package/src/index.ts',
        'common/changes/other-package/change.json',
      ]);

      const result = await helper.collectShouldUpdateChangesProjects();

      expect(result).toEqual([mockProject]);
    });

    it('should handle empty changed files', async () => {
      const mockRushConfig = {
        rushJsonFolder: '/root/path',
        changesFolder: '/root/path/common/changes',
        getProjectLookupForRoot: vi.fn().mockReturnValue({
          findChildPath: vi.fn(),
        }),
      };

      vi.mocked(projectAnalyzer.getRushConfiguration).mockReturnValue(
        mockRushConfig as any,
      );
      vi.mocked(gitCommand.getChangedFilesFromCached).mockResolvedValue([]);

      const result = await helper.collectShouldUpdateChangesProjects();
      expect(result).toEqual([]);
    });
  });

  describe('parseCommit', () => {
    it('should parse commit message correctly', async () => {
      const message = 'feat(scope): test commit message';
      const result = await helper.parseCommit(message);

      expect(result).toMatchObject({
        type: 'feat',
        scope: 'scope',
        subject: 'test commit message',
        raw: message,
      });
    });

    it('should handle commit message without scope', async () => {
      const message = 'fix: test commit';
      const result = await helper.parseCommit(message);

      expect(result).toMatchObject({
        type: 'fix',
        subject: 'test commit',
        raw: message,
      });
    });
  });

  describe('whatBump', () => {
    it('should determine major version bump for breaking changes', () => {
      const commits = [
        {
          notes: [
            { title: 'BREAKING CHANGE', text: 'breaking change description' },
          ],
          type: 'feat',
        },
      ];

      const result = helper.whatBump(commits as any);

      expect(result).toEqual({
        level: 0,
        releaseType: 'major',
        reason: 'There is 1 BREAKING CHANGE and 0 features',
      });
    });

    it('should determine minor version bump for features', () => {
      const commits = [
        {
          notes: [],
          type: 'feat',
        },
      ];

      const result = helper.whatBump(commits as any);

      expect(result).toEqual({
        level: 1,
        releaseType: 'minor',
        reason: 'There are 0 BREAKING CHANGES and 1 features',
      });
    });

    it('should determine patch version bump for other changes', () => {
      const commits = [
        {
          notes: [],
          type: 'fix',
        },
      ];

      const result = helper.whatBump(commits as any);

      expect(result).toEqual({
        level: 2,
        releaseType: 'patch',
        reason: 'There are 0 BREAKING CHANGES and 0 features',
      });
    });
  });

  describe('analysisCommitMsg', () => {
    it('should analyze commit message and return type and content', async () => {
      const message = 'feat(scope): test feature';
      const result = await helper.analysisCommitMsg(message);

      expect(result).toEqual({
        type: 'minor',
        content: 'test feature',
      });
    });
  });
});
