import { isPlainObject } from 'lodash-es';
import { type ParsedEvent, EventSourceParserStream } from 'eventsource-parser/stream';

import { PartialJSONParser } from './parser';
import { FetchAPIError } from './error';

export type ParsedResult = ParsedEvent & {
  json: unknown;
};
export type StreamType = AsyncIterable<ParsedResult> & ReadableStream<ParsedResult>;

export interface FetchAPIOptions extends Omit<RequestInit, 'body'> {
  // Custom fetch function
  fetch?: typeof globalThis.fetch;
  // Fetch body
  body?: RequestInit['body'] | Record<string, unknown>;
  // Whether to fix partial JSON in stream mode, default is true
  fixPartialJSON?: boolean;
  // Fired when receive chunk in stream mode
  onStreamChunk?: (chunk: ParsedResult) => void;
  // Fired when flush in stream mode
  onStreamClose?: () => void;
}

/**
 * Call an API, the result may be either streaming or non-streaming
 *
 * e.g.
 *
 * // streaming mode
 * const { stream } = await fetchAPI('someUrl');
 * for await (const chunk of stream()) {
 *   console.log(chunk);
 * }
 *
 * // non-streaming mode
 * const { output } = await fetchAPI('someUrl');
 * const result = await output();
 */
export async function fetchAPI<ResultType>(url: string, options: FetchAPIOptions = {}) {
  const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers);
  const jsonParser = (options.fixPartialJSON ?? true) ? new PartialJSONParser() : null;

  const fetch = options.fetch ?? globalThis.fetch;
  const response = await fetch(url, {
    method: options.method ?? 'POST',
    headers: Object.fromEntries(Object.entries(headers).filter(([_k, v]) => v !== undefined)) as Record<string, string>,
    body: isPlainObject(options.body) ? JSON.stringify(options.body) : (options.body as RequestInit['body']),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new FetchAPIError({ message: response.statusText });
  }

  let bodyStream = response.body;

  return {
    /**
     * Consume the response body in streaming mode
     * @param tee true means that the stream can be consumed multiple times
     */
    stream: (tee?: boolean): StreamType => {
      if (!bodyStream) {
        throw new FetchAPIError({ message: 'response is null' });
      }
      let nextStream: ReadableStream = bodyStream;
      if (tee) {
        const [stream1, stream2] = bodyStream.tee();
        bodyStream = stream2;
        nextStream = stream1;
      }
      let accChunkString = '';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- ignored
      const transformStream: any = nextStream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream())
        .pipeThrough(
          new TransformStream({
            start: () => {
              accChunkString = '';
            },
            transform: (chunk, controller) => {
              accChunkString += chunk.data;
              const transformChunk: ParsedResult = {
                ...chunk,
                json: {},
              };
              if (jsonParser) {
                transformChunk.json = jsonParser.safeParse(accChunkString);
              }
              options.onStreamChunk?.(transformChunk);
              controller.enqueue(transformChunk);
            },
            flush: () => {
              options.onStreamClose?.();
            },
          }),
        );

      transformStream[Symbol.asyncIterator] = () => {
        const reader = transformStream.getReader();
        return {
          async next(): Promise<IteratorResult<ResultType>> {
            const { done, value } = await reader.read();
            return done ? { done: true, value: undefined } : { done: false, value };
          },
        };
      };
      return transformStream;
    },

    /**
     * Consume the response body in non-streaming mode
     */
    output: async (): Promise<ResultType> => await response.json(),
    response,
  };
}
