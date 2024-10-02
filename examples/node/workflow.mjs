import { client, botId, workflowId } from './client.mjs';

const workflow = await client.workflows.runs.stream({
  workflow_id: workflowId,
  parameters: { query: 'JavaScript' },
  bot_id: botId,
});

for await (const event of workflow) {
  console.log('event', event);
}
