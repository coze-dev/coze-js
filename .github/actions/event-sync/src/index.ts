import { context } from '@actions/github';
import { getInput, setFailed, warning } from '@actions/core';

import { LarkPlatform } from './platforms/lark';
import { handlerFactory } from './handlers/handler-factory';

async function run() {
  try {
    const larkWebhookUrl = getInput('lark_webhook_url', { required: true });
    const larkPersonOpenIds = JSON.parse(
      getInput('lark_person_open_ids', { required: false }) || '{}',
    );
    const platform = new LarkPlatform(larkWebhookUrl, larkPersonOpenIds);

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
