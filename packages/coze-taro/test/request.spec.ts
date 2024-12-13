import { type Deferred } from '../src/helpers/async';
import { AbortController } from '../src/helpers/abortcontroller';
import { sendRequest } from '../src/event-source/request';
import { ttCreateEventSource } from './stubs';

vi.stubGlobal('tt', {
  createEventSource: ttCreateEventSource,
});

vi.mock('../src/event-source/index', async () => {
  const mod = await vi.importActual('../src/event-source/index.tt');
  return mod;
});

describe('SSERequest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should receive result', () => {
    const result = {
      messages: [],
      done: false,
      deferred: null,
    };
    sendRequest({ url: 'xx' }, result);
    expect(result.done).toBe(false);
    expect(result.messages).toEqual([]);
    expect(result.deferred).not.toBeNull();
    vi.runAllTimers();
    expect(result.messages.length).toEqual(4);
    expect(result.done).toEqual(true);
  });

  it('should abort correctly', async () => {
    const result: {
      messages: Array<unknown>;
      done: boolean;
      deferred: Deferred | null;
    } = {
      messages: [],
      done: false,
      deferred: null,
    };
    const controller = new AbortController();
    sendRequest({ url: 'xx', signal: controller.signal }, result);

    setTimeout(() => {
      controller.abort();
    }, 5);

    vi.runAllTimersAsync();
    await expect(result.deferred?.promise).rejects.toThrowError();
    expect(result.done).toBe(true);
  });
});
