import { CozeAPI } from '../src/api';

vi.mock('../src/mixins/platform', async () => {
  const mod = await vi.importActual('../src/mixins/platform.weapp');
  return mod;
});

vi.mock('../src/event-source/index', async () => {
  const mod = await vi.importActual('../src/event-source/index.weapp');
  return mod;
});

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
      const chunks = cozeApi.chat.stream({ bot_id: 'xx' });
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
