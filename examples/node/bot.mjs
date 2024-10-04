import { client, spaceId } from './client.mjs';

async function main() {
  const bot = await client.bots.create({
    space_id: spaceId,
    name: 'test',
    description: 'test',
  });
  console.log('client.bots.create', bot);

  const updatedBot = await client.bots.update({ bot_id: bot.bot_id, name: 'test2', description: 'test2' });
  console.log('client.bots.update', updatedBot);

  const publishedBot = await client.bots.publish({ bot_id: bot.bot_id, connector_ids: ['API'] });
  console.log('client.bots.publish', publishedBot);

  const list = await client.bots.list({ space_id: spaceId, page_index: 1, page_size: 10 });
  console.log('client.bots.list', list);

  if (list.space_bots.length > 0) {
    const info = await client.bots.retrieve({ bot_id: list.space_bots[0].bot_id });
    console.log('client.bots.retrieve', info);
  }
}

main();
