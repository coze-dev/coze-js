class Stream<T, F extends Record<string, string>> {
  private stream: ReadableStream;
  private reader: ReadableStreamDefaultReader;
  private decoder: TextDecoder;
  private handler: (message: F) => T;
  private fieldPrefixes: F;

  constructor(stream: ReadableStream, fieldPrefixes: F, handler: (message: F) => T) {
    this.stream = stream;
    this.reader = this.stream.getReader();
    this.decoder = new TextDecoder();
    this.handler = handler;
    this.fieldPrefixes = fieldPrefixes;
  }

  async *[Symbol.asyncIterator]() {
    const fieldValues: Record<string, string> = {};

    let buffer = '';
    while (true) {
      const { done, value } = await this.reader.read();
      if (done) {
        // if (buffer) yield buffer;
        break;
      }
      buffer += this.decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i];
        for (const [field, prefix] of Object.entries(this.fieldPrefixes)) {
          if (line.startsWith(prefix)) {
            const content = line.substring(prefix.length).trim();
            fieldValues[field] = content;
            if (field === 'data') {
              yield this.handler(fieldValues as F);
            }
            break;
          }
        }
      }
      buffer = lines[lines.length - 1]; // Keep the last incomplete line in the buffer
    }
  }
}

export default Stream;
