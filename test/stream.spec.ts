import Stream from '../src/stream';

describe('Stream', () => {
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

  it('should correctly parse and yield data', async () => {
    const fieldPrefixes = {
      event: 'event: ',
      data: 'data: ',
    };

    const handler = (message: typeof fieldPrefixes) => ({
      event: message.event,
      data: message.data,
    });

    const stream = new Stream(mockReadableStream, fieldPrefixes, handler);

    mockReader.read = jest
      .fn()
      .mockResolvedValueOnce({ value: new TextEncoder().encode('event: test_event\n'), done: false })
      .mockResolvedValueOnce({ value: new TextEncoder().encode('data: { "key": "value" }\n'), done: false })
      .mockResolvedValueOnce({ done: true });

    const results: ReturnType<typeof handler>[] = [];
    for await (const chunk of stream) {
      results.push(chunk);
    }

    expect(results).toEqual([
      {
        event: 'test_event',
        data: '{ "key": "value" }',
      },
    ]);
  });

  it('should handle incomplete lines and multiple chunks', async () => {
    const fieldPrefixes = {
      event: 'event: ',
      data: 'data: ',
    };

    const handler = (message: typeof fieldPrefixes) => ({
      event: message.event,
      data: message.data,
    });

    const stream = new Stream(mockReadableStream, fieldPrefixes, handler);

    mockReader.read = jest
      .fn()
      .mockResolvedValueOnce({ value: new TextEncoder().encode('event: test_event\n'), done: false })
      .mockResolvedValueOnce({ value: new TextEncoder().encode('data: partial_data\n'), done: false })
      .mockResolvedValueOnce({ value: new TextEncoder().encode('event: test_event\n'), done: false })
      .mockResolvedValueOnce({ value: new TextEncoder().encode('data: complete_data\n'), done: false })
      .mockResolvedValueOnce({ done: true });

    const results: ReturnType<typeof handler>[] = [];
    for await (const chunk of stream) {
      results.push(chunk);
    }

    expect(results).toEqual([
      {
        event: 'test_event',
        data: 'partial_data',
      },
      {
        event: 'test_event',
        data: 'complete_data',
      },
    ]);
  });

  it('should handle empty chunks', async () => {
    const fieldPrefixes = {
      data: 'data: ',
    };

    const handler = (message: typeof fieldPrefixes) => ({
      data: message.data,
    });

    const stream = new Stream(mockReadableStream, fieldPrefixes, handler);

    mockReader.read = jest
      .fn()
      .mockResolvedValueOnce({ value: new TextEncoder().encode(''), done: false })
      .mockResolvedValueOnce({ value: new TextEncoder().encode('data: test\n'), done: false })
      .mockResolvedValueOnce({ done: true });

    const results: ReturnType<typeof handler>[] = [];
    for await (const chunk of stream) {
      results.push(chunk);
    }

    expect(results).toEqual([
      {
        data: 'test',
      },
    ]);
  });
});
