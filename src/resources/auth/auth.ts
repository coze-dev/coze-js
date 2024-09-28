import { type CozeAPI } from '../../index.js';
import { APIResource } from '../resource.js';

export class Auth extends APIResource {
  type: string;
  token: string;

  constructor(client: CozeAPI) {
    super(client);
    this.type = client.authConfig.type;
    this.token = '';
  }

  getToken() {
    return this.token;
  }

  getRedirectUrl() {
    throw new Error('Not implemented');
  }

  authorize() {
    throw new Error('Not implemented');
  }

  authentication(headers: Headers) {
    headers.set('Authorization', `Bearer ${this.getToken()}`);
  }
}
