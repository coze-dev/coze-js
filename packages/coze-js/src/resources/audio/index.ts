import { Rooms } from './rooms/index.js';
import { APIResource } from '../resource.js';

export class Audio extends APIResource {
  rooms: Rooms = new Rooms(this._client);
}

export * from './rooms/index.js';
