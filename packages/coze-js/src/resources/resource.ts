import { type APIClient } from '../core';

export class APIResource {
  protected _client: APIClient;

  constructor(client: APIClient) {
    this._client = client;
  }
}

export interface ErrorData {
  detail?: string;
  logid?: string;
  help_doc?: string;
}
