import { CozeAPI } from '../../src/index';
import { Workflows } from '../../src/resources/workflows/index';
import { type RunWorkflowReq, WorkflowEventType, WorkflowEvent } from '../../src/resources/workflows/runs/runs';
import Stream from '../../src/stream';

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
        jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

        const params: RunWorkflowReq = {
          workflow_id: 'workflow-id',
          bot_id: 'bot-id',
          parameters: { key: 'value' },
          ext: { extra: 'info' },
        };

        const result = await workflows.runs.create(params);

        expect(client.post).toHaveBeenCalledWith('/v1/workflow/run', params);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('stream', () => {
      let mockReadableStream: ReadableStream;
      let mockReader: ReadableStreamDefaultReader;

      beforeEach(() => {
        mockReader = {
          read: jest.fn(),
        } as unknown as ReadableStreamDefaultReader;

        mockReadableStream = {
          getReader: jest.fn().mockReturnValue(mockReader),
        } as unknown as ReadableStream;
      });
      it('should stream workflow run events', async () => {
        jest.spyOn(client, 'post').mockResolvedValue({ body: mockReadableStream });

        const params: RunWorkflowReq = {
          workflow_id: 'workflow-id',
        };

        const result = await workflows.runs.stream(params);

        expect(client.post).toHaveBeenCalledWith('/v1/workflow/stream_run', params, true);
        expect(result).toBeInstanceOf(Stream);
      });
    });

    describe('resume', () => {
      it('should resume a workflow run', async () => {
        const mockResponse = {
          id: 'event-id',
          event: WorkflowEventType.MESSAGE,
          data: { content: 'resumed content' },
        };
        jest.spyOn(client, 'post').mockResolvedValue(mockResponse);

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

        expect(client.post).toHaveBeenCalledWith('/v1/workflow/stream_resume', params);
        expect(result).toEqual(mockResponse);
      });
    });
  });
});
