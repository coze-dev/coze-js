import { client } from './client.js';

async function main() {
  const list = await client.workspaces.list({ page_num: 1, page_size: 10 });
  console.log('client.workspaces.list', list);
}

main().catch(console.error);
