import {
  type EventHandler,
  PullRequestHandler,
  IssueHandler,
  CIFailureHandler,
} from './event-handler';
import { type NotificationPlatform } from '../types';

export const handlerFactory = {
  createHandler(
    eventName: string,
    platform: NotificationPlatform,
  ): EventHandler | null {
    switch (eventName) {
      case 'pull_request_target':
        return new PullRequestHandler(platform);
      case 'issues':
        return new IssueHandler(platform);
      case 'workflow_run':
        return new CIFailureHandler(platform);
      default:
        return null;
    }
  },
};
