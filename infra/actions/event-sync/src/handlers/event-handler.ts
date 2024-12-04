import * as github from '@actions/github';

import { type NotificationMessage, type NotificationPlatform } from '../types';

export abstract class EventHandler {
  constructor(protected platform: NotificationPlatform) {}
  abstract handle(): Promise<void>;
}

export class PullRequestHandler extends EventHandler {
  async handle(): Promise<void> {
    const { pull_request } = github.context.payload;
    if (!pull_request) {
      return;
    }

    const message: NotificationMessage = {
      title: '新的 Pull Request 需要 Review',
      content: `PR: ${pull_request.title}`,
      url: pull_request.html_url,
      creator: pull_request.user.login,
    };

    await this.platform.send(message);
  }
}

export class IssueHandler extends EventHandler {
  async handle(): Promise<void> {
    const { issue } = github.context.payload;
    if (!issue) {
      return;
    }

    const message: NotificationMessage = {
      title: '新的 Issue 已创建',
      content: `Issue: ${issue.title}`,
      url: issue.html_url,
      creator: issue.user.login,
    };

    await this.platform.send(message);
  }
}

export class CIFailureHandler extends EventHandler {
  async handle(): Promise<void> {
    const { workflow_run } = github.context.payload;
    if (!workflow_run || workflow_run.conclusion !== 'failure') {
      return;
    }

    const message: NotificationMessage = {
      title: 'CI 构建失败',
      content: `Workflow: ${workflow_run.name}`,
      url: workflow_run.html_url,
    };

    await this.platform.send(message);
  }
}
