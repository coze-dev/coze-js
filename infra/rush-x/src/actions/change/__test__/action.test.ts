import path from 'path';
import fs from 'fs/promises';

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { logger } from '@coze-infra/rush-logger';

import * as helper from '../helper';
import * as amendCommit from '../amend-commit';
import { generateChangeFiles } from '../action';
import * as projectAnalyzer from '../../../utils/project-analyzer';

// Mock all dependencies
vi.mock('fs/promises');
vi.mock('path');
vi.mock('@coze-infra/rush-logger');
vi.mock('../helper');
vi.mock('../amend-commit');
vi.mock('../../../utils/project-analyzer');

describe('generateChangeFiles', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset environment variables
    delete process.env.CI;
  });

  it('should do nothing in CI environment', async () => {
    process.env.CI = 'true';
    await generateChangeFiles({ ci: false });
    expect(helper.analysisCommitMsg).not.toHaveBeenCalled();
  });

  it('should do nothing when ci option is true', async () => {
    await generateChangeFiles({ ci: true });
    expect(helper.analysisCommitMsg).not.toHaveBeenCalled();
  });

  it('should handle amend commit option', async () => {
    await generateChangeFiles({ amendCommit: true });
    expect(amendCommit.amendCommit).toHaveBeenCalled();
    expect(helper.analysisCommitMsg).not.toHaveBeenCalled();
  });

  it('should read commit message from file when not provided', async () => {
    const mockCommitMsg = 'feat: test commit';
    const mockRushConfig = {
      rushJsonFolder: '/test/path',
    };

    vi.mocked(projectAnalyzer.getRushConfiguration).mockReturnValue(
      mockRushConfig as any,
    );
    vi.mocked(fs.readFile).mockResolvedValue(mockCommitMsg);
    vi.mocked(helper.analysisCommitMsg).mockResolvedValue({
      content: 'test commit',
      type: 'minor',
    });

    await generateChangeFiles({});

    expect(fs.readFile).toHaveBeenCalledWith(
      path.resolve('/test/path', '.git/COMMIT_EDITMSG'),
      'utf-8',
    );
    expect(helper.analysisCommitMsg).toHaveBeenCalledWith(mockCommitMsg);
    expect(helper.generateAllChangesFile).toHaveBeenCalledWith(
      'test commit',
      'minor',
    );
  });

  it('should use provided commit message', async () => {
    const mockCommitMsg = 'feat: direct commit';
    vi.mocked(helper.analysisCommitMsg).mockResolvedValue({
      content: 'direct commit',
      type: 'minor',
    });

    await generateChangeFiles({ commitMsg: mockCommitMsg });

    expect(fs.readFile).not.toHaveBeenCalled();
    expect(helper.analysisCommitMsg).toHaveBeenCalledWith(mockCommitMsg);
    expect(helper.generateAllChangesFile).toHaveBeenCalledWith(
      'direct commit',
      'minor',
    );
  });

  it('should handle invalid commit message', async () => {
    vi.mocked(helper.analysisCommitMsg).mockResolvedValue({
      content: '',
      type: 'minor',
    });

    await generateChangeFiles({ commitMsg: 'invalid commit' });

    expect(logger.warning).toHaveBeenCalledWith('Invalid subject');
    expect(helper.generateAllChangesFile).not.toHaveBeenCalled();
  });

  it('should handle errors', async () => {
    const error = new Error('Test error');
    vi.mocked(helper.analysisCommitMsg).mockRejectedValue(error);

    await generateChangeFiles({ commitMsg: 'test commit' });

    expect(logger.error).toHaveBeenCalledWith(
      `Generate changes file fail \n ${error}`,
    );
  });
});
