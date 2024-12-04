export class Deferred<T = unknown> {
  resolve!: (v: T) => void;
  reject!: (err: Error) => void;
  promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
