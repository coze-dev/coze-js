import { type Deferred } from '../src/helpers/async';
import { AbortController } from '../src/helpers/abortcontroller';
import { sendRequest } from '../src/event-source/request';

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
      error: null,
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
      error: Error | null;
    } = {
      messages: [],
      done: false,
      deferred: null,
      error: null,
    };

    const unhandle = () => {
      // donothing
    };
    process.on('unhandledRejection', unhandle);

    const controller = new AbortController();
    sendRequest({ url: 'xx', signal: controller.signal }, result);

    setTimeout(() => {
      controller.abort();
    }, 5);

    await vi.runAllTimersAsync();
    await expect(result.deferred?.promise).rejects.toThrowError();
    expect(result.done).toBe(true);
  });
});
