import { client, botId, workflowId } from './client.mjs';

const workflow = await client.workflows.runs.stream({
  workflow_id: workflowId,
  parameters: { keyword: '思考' },
  bot_id: botId,
});

console.log('client.workflows.runs.stream', workflow);
