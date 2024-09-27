import { type CozeAPI } from '../index.js';

export class APIResource {
  protected _client: CozeAPI;

  constructor(client: CozeAPI) {
    this._client = client;
  }
}
