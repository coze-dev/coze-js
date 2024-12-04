import { context } from '@actions/github';
import { getInput, setFailed, warning } from '@actions/core';

import { LarkPlatform } from './platforms/lark';
import { handlerFactory } from './handlers/handler-factory';

async function run() {
  try {
    const webhookUrl = getInput('lark_webhook_url', { required: true });
    const platform = new LarkPlatform(webhookUrl);

    const handler = handlerFactory.createHandler(context.eventName, platform);

    if (!handler) {
      warning(`No handler found for event: ${context.eventName}`);
      return;
    }

    await handler.handle();
  } catch (error) {
    setFailed((error as Error).message);
  }
}

run();
