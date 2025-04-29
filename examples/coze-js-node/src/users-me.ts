import { client } from './client';

async function main() {
  const user = await client.users.me();
  console.log('client.users.me', user);
}

main().catch(console.error);
