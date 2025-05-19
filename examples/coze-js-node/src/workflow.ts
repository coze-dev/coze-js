import assert from 'assert';

import {
  RoleType,
  type WorkflowEvent,
  type WorkflowEventInterrupt,
  WorkflowEventType,
} from '@coze/api';

import { client, botId, workflowId } from './client';
async function streamWorkflow() {
  assert(botId, 'botId is required');
  assert(workflowId, 'workflowId is required');
  const workflow = await client.workflows.runs.stream({
    workflow_id: workflowId,
    parameters: { input: 'JavaScript' },
    // bot_id: botId,
  });

  handleStream(workflow);
}

async function handleStream(workflow: AsyncGenerator<WorkflowEvent, void>) {
  for await (const event of workflow) {
    console.log('event', event);
    if (event.event === WorkflowEventType.INTERRUPT) {
      const interrupt = event.data as WorkflowEventInterrupt;
      handleStream(
        await client.workflows.runs.resume({
          workflow_id: workflowId,
          event_id: interrupt.interrupt_data.event_id,
          resume_data: '我是 Coze',
          interrupt_type: interrupt.interrupt_data.type,
        }),
      );
    }
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
