import { client, botId, workflowId } from './client.mjs';

const workflow = await client.workflows.runs.stream({
  workflow_id: workflowId,
  parameters: { norco: 'Hello, world!' },
  bot_id: botId,
});

console.log('client.workflows.runs.stream', workflow);
