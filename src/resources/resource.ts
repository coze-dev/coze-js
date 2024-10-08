import { type APIClient } from '../core.js';
import { type FileLike, FormData } from '../shims/index.js';

export class APIResource {
  protected _client: APIClient;

  constructor(client: APIClient) {
    this._client = client;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected _toFormData(body: any) {
    const formData = new FormData();
    Object.entries(body || {}).map(([key, value]) => {
      if (key === 'file') {
        formData.set('file', value as FileLike, (value as FileLike).name);
      } else {
        formData.set(key, value);
      }
    });
    return formData;
  }
}

export interface ErrorData {
  detail?: string;
  logid?: string;
  help_doc?: string;
}
