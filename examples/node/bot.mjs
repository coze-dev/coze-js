import { client, spaceId } from './client.mjs';

async function main() {
  const list = await client.bots.list({ space_id: spaceId, page_index: 1, page_size: 10 });
  console.log('client.bots.list', list);

  if (list.space_bots.length > 0) {
    const info = await client.bots.retrieve({ bot_id: list.space_bots[0].bot_id });
    console.log('client.bots.retrieve', info);
  }
}

main();
