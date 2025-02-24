import assert from 'assert';

import { RoleType } from '@coze/api';

import { client, botId, workflowId } from './client.js';
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

async function chatWorkflow() {
  assert(botId, 'botId is required');
  assert(workflowId, 'workflowId is required');
  const workflow = await client.workflows.chat.stream({
    workflow_id: workflowId,
    parameters: {},
    bot_id: botId,
    additional_messages: [
      {
        role: RoleType.User,
        content: 'give me a joke',
        content_type: 'text',
      },
    ],
  });
  for await (const event of workflow) {
    console.log('event', event);
  }
}

async function asyncWorkflow() {
  assert(botId, 'botId is required');
  assert(workflowId, 'workflowId is required');
  const workflow = await client.workflows.runs.create({
    workflow_id: workflowId,
    parameters: { input: 'Hello World' },
    is_async: true,
  });
  console.log('workflow', workflow);

  while (true) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const history = await client.workflows.runs.history(
      workflowId,
      workflow.execute_id,
    );
    console.log('history', history);
    if (history[0].execute_status !== 'Running') {
      break;
    }
  }
}

streamWorkflow().catch(console.error);
nonStreamWorkflow().catch(console.error);
chatWorkflow().catch(console.error);
asyncWorkflow().catch(console.error);
