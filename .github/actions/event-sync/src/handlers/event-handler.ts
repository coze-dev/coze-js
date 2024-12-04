import {
  type PullRequestEvent,
  type IssuesEvent,
  type WorkflowRunEvent,
} from '@octokit/webhooks-definitions/schema';
import * as github from '@actions/github';
import { warning } from '@actions/core';

import { type NotificationMessage, type NotificationPlatform } from '../types';

type ActionMessageMap<T extends { action: string }> = Partial<
  Record<T['action'], NotificationMessage>
>;

export abstract class EventHandler {
  constructor(protected platform: NotificationPlatform) {}
  abstract handle(): Promise<void>;
}

export class PullRequestHandler extends EventHandler {
  async handle(): Promise<void> {
    const { pull_request, action } = github.context.payload as PullRequestEvent;
    if (!pull_request) {
      return;
    }

    const messageActionMap: ActionMessageMap<PullRequestEvent> = {
      opened: {
        title: 'NEW Pull Request needs review',
        content: `PR: ${pull_request.title}`,
        url: pull_request.html_url,
        creator: pull_request.user.login,
      },
      closed: {
        title: pull_request.merged
          ? 'Pull Request merged'
          : 'Pull Request closed',
        content: `PR: ${pull_request.title}`,
        url: pull_request.html_url,
        creator: pull_request.user.login,
      },
      reopened: {
        title: 'Pull Request reopened',
        content: `PR: ${pull_request.title}`,
        url: pull_request.html_url,
        creator: pull_request.user.login,
      },
    };

    const message = messageActionMap[action];

    if (message) {
      await this.platform.send(message);
    } else {
      warning(
        `No message found for action 「${action}」 of pull request event.`,
      );
    }
  }
}

export class IssueHandler extends EventHandler {
  async handle(): Promise<void> {
    const { issue, action } = github.context.payload as IssuesEvent;
    if (!issue) {
      return;
    }

    const messageActionMap: ActionMessageMap<IssuesEvent> = {
      opened: {
        title: 'NEW Issue created',
        content: `Issue: ${issue.title}`,
        url: issue.html_url,
        creator: issue.user.login,
      },
    };

    const message = messageActionMap[action];

    if (message) {
      await this.platform.send(message);
    } else {
      warning(`No message found for action 「${action}」 of issue event.`);
    }
  }
}

export class CIFailureHandler extends EventHandler {
  async handle(): Promise<void> {
    const { workflow_run, action } = github.context.payload as WorkflowRunEvent;
    if (!workflow_run || workflow_run.conclusion !== 'failure') {
      return;
    }

    const messageActionMap: ActionMessageMap<WorkflowRunEvent> = {
      completed: {
        title: 'CI build failed',
        content: `Workflow: ${workflow_run.name}`,
        url: workflow_run.html_url,
      },
    };

    const message = messageActionMap[action];

    if (message) {
      await this.platform.send(message);
    } else {
      warning(
        `No message found for action 「${action}」 of workflow run event.`,
      );
    }
  }
}
