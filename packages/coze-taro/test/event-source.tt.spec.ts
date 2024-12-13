import { EventName } from '../src/event-source/types';
import { EventSource } from '../src/event-source/index.tt';
import { ttCreateEventSource } from './stubs';

vi.stubGlobal('tt', {
  createEventSource: ttCreateEventSource,
});

describe('TT-EventSource', () => {
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

  it('should abort correctly', () => {
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
