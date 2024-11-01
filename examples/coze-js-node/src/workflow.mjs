/* eslint-disable no-unused-vars */
import assert from 'assert';

import { client, botId, workflowId } from './client.mjs';
async function streamWorkflow() {
  assert(botId, 'botId is required');
  assert(workflowId, 'workflowId is required');
  const workflow = await client.workflows.runs.stream({
    workflow_id: workflowId,
    parameters: { norco: 'JavaScript' },
    bot_id: botId,
  });

  for await (const event of workflow) {
    console.log('event', event);
  }
}

async function nonStreamWorkflow() {
  assert(botId, 'botId is required');
  assert(workflowId, 'workflowId is required');
  const workflow = await client.workflows.runs.create({
    workflow_id: workflowId,
    parameters: { norco: 'JavaScript' },
    bot_id: botId,
  });
  console.log('workflow', workflow);
}

streamWorkflow();
// nonStreamWorkflow();
