import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as github from '@actions/github';
import { warning } from '@actions/core';

import {
  PullRequestHandler,
  IssueHandler,
  CIFailureHandler,
} from '../event-handler';
import {
  type NotificationPlatform,
  type NotificationMessage,
} from '../../types';

// Mock dependencies
vi.mock('@actions/github', () => ({
  context: {
    payload: {},
  },
}));

vi.mock('@actions/core', () => ({
  warning: vi.fn(),
}));

// Mock notification platform
class MockPlatform implements NotificationPlatform {
  public sentMessages: NotificationMessage[] = [];
  async send(message: NotificationMessage): Promise<void> {
    await this.sentMessages.push(message);
  }
}

describe('PullRequestHandler', () => {
  let platform: MockPlatform;
  let handler: PullRequestHandler;

  beforeEach(() => {
    platform = new MockPlatform();
    handler = new PullRequestHandler(platform);
    vi.clearAllMocks();
  });

  it('should handle opened pull request', async () => {
    const mockPayload = {
      action: 'opened',
      pull_request: {
        number: 1,
        title: 'Test PR',
        html_url: 'https://github.com/test/pr/1',
        user: { login: 'testuser' },
      },
    };
    github.context.payload = mockPayload;

    await handler.handle();

    expect(platform.sentMessages).toHaveLength(1);
    expect(platform.sentMessages[0]).toEqual({
      title: '🚀 NEW Pull Request #1',
      content: 'PR title: Test PR',
      url: 'https://github.com/test/pr/1',
      creator: 'testuser',
    });
  });

  it('should handle merged pull request', async () => {
    const mockPayload = {
      action: 'closed',
      pull_request: {
        number: 1,
        title: 'Test PR',
        html_url: 'https://github.com/test/pr/1',
        user: { login: 'testuser' },
        merged: true,
      },
    };
    github.context.payload = mockPayload;

    await handler.handle();

    expect(platform.sentMessages[0].title).toBe('🎉 Pull Request #1 merged');
  });

  it('should handle no pull request in payload', async () => {
    github.context.payload = { action: 'opened' };
    await handler.handle();
    expect(warning).toHaveBeenCalledWith(
      'No pull request found in the event payload.',
    );
  });
});

describe('IssueHandler', () => {
  let platform: MockPlatform;
  let handler: IssueHandler;

  beforeEach(() => {
    platform = new MockPlatform();
    handler = new IssueHandler(platform);
    vi.clearAllMocks();
  });

  it('should handle opened issue', async () => {
    const mockPayload = {
      action: 'opened',
      issue: {
        number: 1,
        title: 'Test Issue',
        html_url: 'https://github.com/test/issue/1',
        user: { login: 'testuser' },
      },
    };
    github.context.payload = mockPayload;

    await handler.handle();

    expect(platform.sentMessages).toHaveLength(1);
    expect(platform.sentMessages[0]).toEqual({
      title: '🆕 Issue #1 created',
      content: 'Issue title: Test Issue',
      url: 'https://github.com/test/issue/1',
      creator: 'testuser',
    });
  });

  it('should handle no issue in payload', async () => {
    github.context.payload = { action: 'opened' };
    await handler.handle();
    expect(warning).toHaveBeenCalledWith(
      'No issue found in the event payload.',
    );
  });
});

describe('CIFailureHandler', () => {
  let platform: MockPlatform;
  let handler: CIFailureHandler;

  beforeEach(() => {
    platform = new MockPlatform();
    handler = new CIFailureHandler(platform);
    vi.clearAllMocks();
  });

  it('should handle workflow failure', async () => {
    const mockPayload = {
      action: 'completed',
      workflow_run: {
        conclusion: 'failure',
        name: 'CI',
        event: 'push',
        head_branch: 'main',
        html_url: 'https://github.com/test/actions/runs/1',
      },
    };
    github.context.payload = mockPayload;

    await handler.handle();

    expect(platform.sentMessages).toHaveLength(1);
    expect(platform.sentMessages[0]).toEqual({
      title: '❗ Workflow run failed',
      content: '**Workflow name**: CI\n**Workflow title**: undefined\n',
      url: 'https://github.com/test/actions/runs/1',
      creator: undefined,
    });
  });

  it('should not send message for successful workflow', async () => {
    const mockPayload = {
      action: 'completed',
      workflow_run: {
        conclusion: 'success',
        name: 'CI',
        event: 'push',
        head_branch: 'main',
        html_url: 'https://github.com/test/actions/runs/1',
      },
    };
    github.context.payload = mockPayload;

    await handler.handle();

    expect(platform.sentMessages).toHaveLength(0);
    expect(warning).toHaveBeenCalledWith(
      'Workflow run is not failed. Conclusion: success',
    );
  });
});
