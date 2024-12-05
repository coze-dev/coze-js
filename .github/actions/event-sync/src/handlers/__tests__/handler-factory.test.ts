import { describe, it, expect } from 'vitest';

import { handlerFactory } from '../handler-factory';
import {
  PullRequestHandler,
  IssueHandler,
  CIFailureHandler,
} from '../event-handler';
import {
  type NotificationPlatform,
  type NotificationMessage,
} from '../../types';

// Mock notification platform for testing
class MockPlatform implements NotificationPlatform {
  async send(message: NotificationMessage): Promise<void> {
    // Mock implementation
  }
}

describe('handlerFactory', () => {
  const platform = new MockPlatform();

  it('should create PullRequestHandler for pull_request event', () => {
    const handler = handlerFactory.createHandler('pull_request', platform);
    expect(handler).toBeInstanceOf(PullRequestHandler);
  });

  it('should create IssueHandler for issues event', () => {
    const handler = handlerFactory.createHandler('issues', platform);
    expect(handler).toBeInstanceOf(IssueHandler);
  });

  it('should create CIFailureHandler for workflow_run event', () => {
    const handler = handlerFactory.createHandler('workflow_run', platform);
    expect(handler).toBeInstanceOf(CIFailureHandler);
  });

  it('should return null for unknown event', () => {
    const handler = handlerFactory.createHandler('unknown_event', platform);
    expect(handler).toBeNull();
  });

  it('should create handlers with the provided platform', () => {
    const customPlatform = new MockPlatform();
    const handler = handlerFactory.createHandler(
      'pull_request',
      customPlatform,
    );
    // @ts-expect-error accessing protected property for testing
    expect(handler?.platform).toBe(customPlatform);
  });
});
