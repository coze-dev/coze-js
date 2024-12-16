import { EventName } from '../src/event-source/types';
import { EventSource } from '../src/event-source/index.weapp';

describe('Weapp-EventSource', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should fire events', () => {
    const mockOpenFn = vi.fn();
    const mockMessageFn = vi.fn();
    const mockSuccessFn = vi.fn();

    const eventSource = new EventSource({ url: 'xx' })
      .on(EventName.Open, mockOpenFn)
      .on(EventName.Chunk, mockMessageFn)
      .on(EventName.Success, mockSuccessFn);
    eventSource.start();

    vi.runAllTimers();
    expect(mockOpenFn).toHaveBeenCalledOnce();
    expect(mockMessageFn).toHaveBeenCalledTimes(4);
    expect(mockSuccessFn).toHaveBeenCalledOnce();
  });

  it.only('should abort correctly', () => {
    const mockFailFn = vi.fn();

    const eventSource = new EventSource({ url: 'xx' }).on(
      EventName.Fail,
      mockFailFn,
    );
    eventSource.start();

    setTimeout(() => {
      eventSource.abort();
    }, 5);

    vi.runAllTimers();
    expect(mockFailFn).toHaveBeenCalledOnce();
  });
});
