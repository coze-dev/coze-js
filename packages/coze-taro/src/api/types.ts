/* eslint-disable @typescript-eslint/no-invalid-void-type -- ignore */
import { type ClientOptions as InnerClientOptions } from '@coze/api';

export interface ClientOptions extends InnerClientOptions {
  onBeforeAPICall?: (
    options: unknown,
  ) => ({ token?: string } | void) | Promise<{ token?: string } | void>;
}
