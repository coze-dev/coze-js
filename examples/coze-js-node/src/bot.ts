import assert from 'assert';

import { SuggestReplyMode } from '@coze/api';

import { client, sleep, spaceId } from './client';

async function main() {
  assert(spaceId, 'spaceId is required');
  const bot = await client.bots.create({
    space_id: spaceId,
    name: 'Translation Master',
    description:
      'A professional translator that helps translate between English and Chinese',
    prompt_info: {
      prompt:
        'your are a translator, translate the following text from English to Chinese',
    },
    suggest_reply_info: {
      reply_mode: SuggestReplyMode.CUSTOMIZED,
      customized_prompt: 'generate custom user question reply suggestion',
    },
  });
  console.log('client.bots.create', bot);

  const updatedBot = await client.bots.update({
    bot_id: bot.bot_id,
    name: 'test2',
    description: 'test2',
  });
  console.log('client.bots.update', updatedBot);

  const publishedBot = await client.bots.publish({
    bot_id: bot.bot_id,
    connector_ids: ['1024'],
  });
  console.log('client.bots.publish', publishedBot);

  await sleep(1000);
  const list = await client.bots.listNew({
    workspace_id: spaceId,
    page_num: 1,
    page_size: 10,
  });
  console.log('client.bots.list', list);

  const info = await client.bots.retrieveNew(bot.bot_id);
  console.log('client.bots.retrieve', info);
}

main().catch(console.error);
