import { RoleType } from '@coze/api';

import { CozeAPI } from '../src/api';

describe('CozeAPI - mini', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('#Config', () => {
    it('should call onBeforeAPICall', async () => {
      const mockOnBeforeAPICall = vi.fn();

      const cozeApi = new CozeAPI({
        token: '',
        onBeforeAPICall: mockOnBeforeAPICall,
      });
      const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'xx' });
      vi.runAllTimersAsync();

      const caches = [];
      for await (const chunk of chunks) {
        caches.push(chunk);
      }
      expect(mockOnBeforeAPICall).toHaveBeenCalledOnce();

      await cozeApi.workflows.runs.create({
        workflow_id: 'nonStreaming',
      });
      expect(mockOnBeforeAPICall).toHaveBeenCalledTimes(2);
    });

    it('should refresh token', async () => {
      const cozeApi = new CozeAPI({
        token: '',
        onBeforeAPICall: () => ({ token: 'newToken' }),
      });
      expect(cozeApi.token).toEqual('');
      const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'xx' });
      vi.runAllTimersAsync();

      const caches = [];
      for await (const chunk of chunks) {
        caches.push(chunk);
      }
      expect(cozeApi.token).toEqual('newToken');
    });

    it('should not refresh token', async () => {
      const cozeApi = new CozeAPI({
        token: '',
        onBeforeAPICall: () => ({}),
      });
      expect(cozeApi.token).toEqual('');
      const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'xx' });
      vi.runAllTimersAsync();

      const caches = [];
      for await (const chunk of chunks) {
        caches.push(chunk);
      }
      expect(cozeApi.token).toEqual('');
    });

    it('should throw error', async () => {
      const cozeApi = new CozeAPI({
        token: '',
        onBeforeAPICall: () => ({ token: 'newToken' }),
      });
      expect(cozeApi.token).toEqual('');
      await expect(async () => {
        const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'fail' });
        vi.runAllTimersAsync();
        const caches = [];
        for await (const chunk of chunks) {
          caches.push(chunk);
        }
      }).rejects.toThrowError();
    });

    it('should work with timeout', async () => {
      const cozeApi = new CozeAPI({
        token: '',
        axiosOptions: {
          timeout: 5,
        },
      });

      const unhandle = () => {
        // donothing
      };
      process.on('unhandledRejection', unhandle);

      await expect(async () => {
        const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'xx' });
        vi.runAllTimersAsync();
        const caches = [];
        for await (const chunk of chunks) {
          caches.push(chunk);
        }
      }).rejects.toThrowError();
    });
  });

  describe('#API', () => {
    it('should work with chat', async () => {
      const cozeApi = new CozeAPI({
        token: '',
        onBeforeAPICall: () => ({}),
      });
      expect(cozeApi.token).toEqual('');
      const chunks = cozeApi.chat.stream({
        bot_id: 'xx',
        additional_messages: [
          {
            role: RoleType.User,
            content: 'Hello, world!',
            content_type: 'text',
          },
          {
            role: RoleType.Assistant,
            content: [
              {
                type: 'text',
                text: 'Hello, world!',
              },
            ],
            content_type: 'object_string',
          },
        ],
        shortcut_command: {
          command_id: 'command_id',
          parameters: {
            key1: {
              type: 'text',
              text: 'value1',
            },
            key2: {
              type: 'file',
              file_id: 'file_id',
            },
          },
        },
      });
      vi.runAllTimersAsync();

      const caches = [];
      for await (const chunk of chunks) {
        caches.push(chunk);
      }
      expect(caches.length).toEqual(4);
    });

    it('should work with workflow chat', async () => {
      const cozeApi = new CozeAPI({
        token: '',
        onBeforeAPICall: () => ({}),
      });
      expect(cozeApi.token).toEqual('');
      const chunks = cozeApi.workflows.chat.stream({
        bot_id: 'xx',
        workflow_id: 'xx',
        additional_messages: [],
        parameters: {},
      });
      vi.runAllTimersAsync();
      const caches = [];
      for await (const chunk of chunks) {
        caches.push(chunk);
      }
    });

    it('should work with uploadFile', async () => {
      const cozeApi = new CozeAPI({
        token: '',
      });
      const data = await cozeApi.files.upload({ file: 'xx' });
      expect(data).toEqual({ mock: 'xx' });
    });
  });
});
