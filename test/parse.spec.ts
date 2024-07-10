import { getBytes, getLines, getMessages, concat } from "../src/parse";

describe("EventSource Parsing Functions", () => {
  describe("getBytes", () => {
    it("should call onChunk for each chunk in the stream", async () => {
      const mockStream = {
        getReader: () => ({
          read: jest
            .fn()
            .mockResolvedValueOnce({
              value: new Uint8Array([1, 2, 3]),
              done: false,
            })
            .mockResolvedValueOnce({
              value: new Uint8Array([4, 5, 6]),
              done: false,
            })
            .mockResolvedValueOnce({ done: true }),
          releaseLock: jest.fn(),
        }),
      } as unknown as ReadableStream<Uint8Array>;

      const onChunk = jest.fn();
      await getBytes(mockStream, onChunk);

      expect(onChunk).toHaveBeenCalledTimes(2);
      expect(onChunk).toHaveBeenNthCalledWith(1, new Uint8Array([1, 2, 3]));
      expect(onChunk).toHaveBeenNthCalledWith(2, new Uint8Array([4, 5, 6]));
    });
  });

  describe("getLines", () => {
    it("should parse chunks into lines", () => {
      const onLine = jest.fn();
      const processChunk = getLines(onLine);

      processChunk(new Uint8Array([65, 66, 58, 67, 68, 13, 10])); // "AB:CD\r\n"
      processChunk(new Uint8Array([69, 70, 58, 71, 72, 10])); // "EF:GH\n"

      expect(onLine).toHaveBeenCalledTimes(2);
      expect(onLine).toHaveBeenNthCalledWith(
        1,
        new Uint8Array([65, 66, 58, 67, 68]),
        2
      );
      expect(onLine).toHaveBeenNthCalledWith(
        2,
        new Uint8Array([69, 70, 58, 71, 72]),
        2
      );
    });
  });

  describe("getMessages", () => {
    it("should parse lines into EventSourceMessages", () => {
      const onId = jest.fn();
      const onRetry = jest.fn();
      const onMessage = jest.fn();
      const processLine = getMessages(onId, onRetry, onMessage);

      processLine(new TextEncoder().encode("event: update"), 5);
      processLine(new TextEncoder().encode('data: {"foo":"bar"}'), 4);
      processLine(new TextEncoder().encode("id: 1"), 2);
      processLine(new Uint8Array(0), 0);

      expect(onMessage).toHaveBeenCalledWith({
        event: "update",
        data: '{"foo":"bar"}',
        id: "1",
        retry: undefined,
      });
    });
  });

  describe("concat", () => {
    it("should concatenate two Uint8Arrays", () => {
      const a = new Uint8Array([1, 2, 3]);
      const b = new Uint8Array([4, 5, 6]);
      const result = concat(a, b);
      expect(result).toEqual(new Uint8Array([1, 2, 3, 4, 5, 6]));
    });
  });
});
