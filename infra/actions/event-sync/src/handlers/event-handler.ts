/* eslint-disable @typescript-eslint/no-explicit-any -- some types are not defined in @octokit/webhooks-definitions */
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

// TODO: some event need to be filtered out or send to specific person

export abstract class EventHandler {
  constructor(protected platform: NotificationPlatform) {}
  abstract handle(): Promise<void>;
}

export class PullRequestHandler extends EventHandler {
  async handle(): Promise<void> {
    const { pull_request, action } = github.context.payload as PullRequestEvent;
    if (!pull_request) {
      warning('No pull request found in the event payload.');
      return;
    }

    const messageActionMap: ActionMessageMap<PullRequestEvent> = {
      opened: {
        title: `🚀 NEW Pull Request #${pull_request.number}`,
        content: `PR title: ${pull_request.title}`,
        url: pull_request.html_url,
        creator: pull_request.user.login,
      },
      closed: {
        title: pull_request.merged
          ? `🎉 Pull Request #${pull_request.number} merged`
          : `❌ Pull Request #${pull_request.number} closed`,
        content: `PR title: ${pull_request.title}`,
        url: pull_request.html_url,
        creator: pull_request.user.login,
      },
      reopened: {
        title: `🔄 Pull Request #${pull_request.number} reopened`,
        content: `PR title: ${pull_request.title}`,
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
      warning('No issue found in the event payload.');
      return;
    }

    const messageActionMap: ActionMessageMap<IssuesEvent> = {
      opened: {
        title: `🆕 Issue #${issue.number} created`,
        content: `Issue title: ${issue.title}`,
        url: issue.html_url,
        creator: issue.user.login,
      },
      closed: {
        title: `❌ Issue #${issue.number} closed`,
        content: `Issue title: ${issue.title}`,
        url: issue.html_url,
        creator: issue.user.login,
      },
      reopened: {
        title: `🔄 Issue #${issue.number} reopened`,
        content: `Issue title: ${issue.title}`,
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
    if (!workflow_run) {
      warning('No workflow run found in the event payload.');
      return;
    }

    if (workflow_run.conclusion !== 'failure') {
      warning(
        `Workflow run is not failed. Conclusion: ${workflow_run.conclusion}`,
      );
      return;
    }

    // for debug
    console.log(JSON.stringify(workflow_run, null, 2));

    const messageActionMap: ActionMessageMap<WorkflowRunEvent> = {
      completed: {
        title: '❗ Workflow run failed',
        content: `\
**Workflow name**: ${workflow_run.name}
**Workflow title**: ${(workflow_run as any).display_title}
${workflow_run.pull_requests?.length ? `**PRs**: ${workflow_run.pull_requests.map(pr => `[#${pr.number}](${pr.url})]`).join('、')}` : ''}`,
        url: workflow_run.html_url,
        // @ts-expect-error -- type ignore
        creator: workflow_run.actor?.login,
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
