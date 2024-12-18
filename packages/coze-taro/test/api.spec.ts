import { CozeAPI } from '../src/api';
import { ttCreateEventSource } from './stubs';

vi.stubGlobal('tt', {
  createEventSource: ttCreateEventSource,
});

vi.mock('../src/mixins/platform', async () => {
  const mod = await vi.importActual('../src/mixins/platform.tt');
  return mod;
});

vi.mock('../src/event-source/index', async () => {
  const mod = await vi.importActual('../src/event-source/index.tt');
  return mod;
});

describe('CozeAPI - mini', () => {
  it('should call onBeforeAPICall', async () => {
    const mockOnBeforeAPICall = vi.fn();

    const cozeApi = new CozeAPI({
      token: '',
      onBeforeAPICall: mockOnBeforeAPICall,
    });
    const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'xx' });
    const caches = [];
    for await (const chunk of chunks) {
      caches.push(chunk);
    }
    expect(mockOnBeforeAPICall).toHaveBeenCalledOnce();
  });

  it('should refresh token', async () => {
    const cozeApi = new CozeAPI({
      token: '',
      onBeforeAPICall: () => ({ token: 'newToken' }),
    });
    expect(cozeApi.token).toEqual('');
    const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'xx' });
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
    const caches = [];
    for await (const chunk of chunks) {
      caches.push(chunk);
    }
    expect(cozeApi.token).toEqual('');
  });

  it('should work with chat', async () => {
    const cozeApi = new CozeAPI({
      token: '',
      onBeforeAPICall: () => ({}),
    });
    expect(cozeApi.token).toEqual('');
    const chunks = cozeApi.chat.stream({ bot_id: 'xx' });
    const caches = [];
    for await (const chunk of chunks) {
      caches.push(chunk);
    }
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
    const caches = [];
    for await (const chunk of chunks) {
      caches.push(chunk);
    }
  });

  it('should throw error', async () => {
    const cozeApi = new CozeAPI({
      token: '',
      onBeforeAPICall: () => ({ token: 'newToken' }),
    });
    expect(cozeApi.token).toEqual('');
    await expect(async () => {
      const chunks = cozeApi.workflows.runs.stream({ workflow_id: 'fail' });
      const caches = [];
      for await (const chunk of chunks) {
        caches.push(chunk);
      }
    }).rejects.toThrowError();
  });
});
