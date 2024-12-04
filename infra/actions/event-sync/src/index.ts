import * as github from '@actions/github';
import * as core from '@actions/core';

import { LarkPlatform } from './platforms/lark';
import { handlerFactory } from './handlers/handler-factory';

async function run() {
  try {
    const webhookUrl = core.getInput('webhook_url', { required: true });
    const platform = new LarkPlatform(webhookUrl);

    const handler = handlerFactory.createHandler(
      github.context.eventName,
      platform,
    );
    if (!handler) {
      core.info(`No handler found for event: ${github.context.eventName}`);
      return;
    }

    await handler.handle();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
