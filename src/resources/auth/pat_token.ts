import { type CozeAPI } from '../../index.js';
import { Auth } from './auth.js';

export class PatTokenAuth extends Auth {
  constructor(client: CozeAPI) {
    super(client);
    if (client.authConfig.type !== 'pat_token') {
      throw new Error('Invalid auth type');
    }
    this.token = client.authConfig.token;
  }
}
