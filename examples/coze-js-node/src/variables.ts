import { botId, client, sleep } from './client';

// eslint-disable-next-line @typescript-eslint/naming-convention
async function bot_variables() {
  client.variables.update({
    // app_id: '123',
    bot_id: botId,
    data: [{ keyword: 'input', value: 'Hello2' }],
  });

  await sleep(1000);

  const result = await client.variables.retrieve({
    bot_id: botId,
    keywords: [],
  });
  console.log('result', result);
}

// eslint-disable-next-line @typescript-eslint/naming-convention
async function app_variables() {
  client.variables.update({
    app_id: '7497905162918035493',
    data: [{ keyword: 'input', value: '你好' }],
  });

  await sleep(1000);

  const result = await client.variables.retrieve({
    app_id: '7497905162918035493',
    connector_id: '1024',
    keywords: [],
  });
  console.log('result', result);
}

bot_variables().catch(console.error);
app_variables().catch(console.error);
