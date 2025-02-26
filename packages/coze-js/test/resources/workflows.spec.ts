import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  type RunWorkflowReq,
  WorkflowEventType,
} from '../../src/resources/workflows/runs/runs';
import { Workflows } from '../../src/resources/workflows/index';
import { ChatEventType, RoleType } from '../../src/resources/chat/chat.js';
import { CozeAPI } from '../../src/index';

describe('Workflows', () => {
  let client: CozeAPI;
  let workflows: Workflows;

  beforeEach(() => {
    client = new CozeAPI({ token: 'test-token' });
    workflows = new Workflows(client);
  });

  describe('Runs', () => {
    describe('create', () => {
      it('should create a workflow run', async () => {
        const mockResponse = { data: { run_id: 'run-id' } };
        vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

        const params: RunWorkflowReq = {
          workflow_id: 'workflow-id',
          bot_id: 'bot-id',
          parameters: { key: 'value' },
          ext: { extra: 'info' },
        };

        const result = await workflows.runs.create(params);

        expect(client.post).toHaveBeenCalledWith(
          '/v1/workflow/run',
          params,
          false,
          undefined,
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('stream', () => {
      let mockReadableStream: ReadableStream;
      let mockReader: ReadableStreamDefaultReader;

      beforeEach(() => {
        mockReader = {
          read: vi.fn(),
        } as unknown as ReadableStreamDefaultReader;

        mockReadableStream = {
          getReader: vi.fn().mockReturnValue(mockReader),
        } as unknown as ReadableStream;
      });
      it('should stream workflow run events', async () => {
        vi.spyOn(client, 'post').mockResolvedValue({
          body: mockReadableStream,
        });

        const params: RunWorkflowReq = {
          workflow_id: 'workflow-id',
        };

        await workflows.runs.stream(params);

        // expect(client.post).toHaveBeenCalledWith('/v1/workflow/stream_run', params, true, undefined);
        // expect(result).toBeInstanceOf(Stream);
      });
    });

    describe('resume', () => {
      it('should resume a workflow run', async () => {
        const mockResponse = {
          id: 'event-id',
          event: WorkflowEventType.MESSAGE,
          data: { content: 'resumed content' },
        };
        vi.spyOn(client, 'post').mockResolvedValue(mockResponse);

        const params = {
          workflow_id: 'workflow-id',
          run_id: 'run-id',
          event_id: 'event-id',
          type: 1,
          input: 'user input',
          resume_data: 'resume data',
          interrupt_type: 1,
        };

        const result = await workflows.runs.resume(params);

        expect(client.post).toHaveBeenCalledWith(
          '/v1/workflow/stream_resume',
          params,
          false,
          undefined,
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('history', () => {
      it('should get the workflow run history', async () => {
        const mockResponse = { data: [{ id: 'event-id' }] };
        vi.spyOn(client, 'get').mockResolvedValue(mockResponse);

        const result = await workflows.runs.history('workflow-id', 'run-id');

        expect(client.get).toHaveBeenCalledWith(
          '/v1/workflows/workflow-id/run_histories/run-id',
          undefined,
          false,
          undefined,
        );
        expect(result).toEqual(mockResponse.data);
      });
    });
  });

  describe('Chat', () => {
    describe('stream', () => {
      it('should handle successful chat workflow stream', async () => {
        // Mock the stream response
        const mockMessages = [
          {
            event: ChatEventType.CONVERSATION_MESSAGE_DELTA,
            data: JSON.stringify({ content: 'Hello' }),
          },
          {
            event: ChatEventType.CONVERSATION_MESSAGE_DELTA,
            data: JSON.stringify({ content: 'World' }),
          },
          { event: ChatEventType.DONE, data: '' },
        ];

        const mockAsyncGenerator = function* () {
          for (const message of mockMessages) {
            yield message;
          }
        };

        vi.spyOn(client, 'post').mockResolvedValue(mockAsyncGenerator());

        const params = {
          workflow_id: 'test-workflow',
          additional_messages: [{ role: RoleType.User, content: 'Hi' }],
          parameters: {},
        };

        const messages = [];
        for await (const message of client.workflows.chat.stream(params)) {
          messages.push(message);
        }

        // Verify the results
        expect(messages).toHaveLength(3);
        expect(messages[0]).toEqual({
          event: ChatEventType.CONVERSATION_MESSAGE_DELTA,
          data: { content: 'Hello' },
        });
        expect(messages[1]).toEqual({
          event: ChatEventType.CONVERSATION_MESSAGE_DELTA,
          data: { content: 'World' },
        });
        expect(messages[2]).toEqual({
          event: ChatEventType.DONE,
          data: '[DONE]',
        });

        // Verify API call
        expect(client.post).toHaveBeenCalledWith(
          '/v1/workflows/chat',
          {
            workflow_id: 'test-workflow',
            additional_messages: [{ role: 'user', content: 'Hi' }],
            parameters: {},
          },
          true,
          undefined,
        );
      });

      it('should handle JSON parse error in chat workflow stream', async () => {
        // Mock an invalid JSON response
        const mockAsyncGenerator = function* () {
          yield {
            event: ChatEventType.CONVERSATION_MESSAGE_DELTA,
            data: 'invalid json',
          };
        };

        vi.spyOn(client, 'post').mockResolvedValue(mockAsyncGenerator());

        const params = {
          workflow_id: 'test-workflow',
          additional_messages: [{ role: RoleType.User, content: 'Hi' }],
          parameters: {},
        };

        await expect(async () => {
          //  @typescript-eslint/no-unused-vars
          for await (const message of client.workflows.chat.stream(params)) {
            // Intentionally consume messages without using them
            void message;
          }
        }).rejects.toThrow('Could not parse message into JSON:invalid json');
      });
    });
  });
});
