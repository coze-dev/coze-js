export class FetchAPIError extends Error {
  readonly cause?: unknown;

  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(message);
    this.cause = cause;
  }
}

export class JSONParseError extends Error {
  readonly cause?: unknown;

  constructor({ message, cause }: { message: string; cause?: unknown }) {
    super(message);
    this.cause = cause;
  }
}
