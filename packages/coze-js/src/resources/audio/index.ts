import { Voices } from './voices/index.js';
import { Speech } from './speech/index.js';
import { Rooms } from './rooms/index.js';
import { APIResource } from '../resource.js';

export class Audio extends APIResource {
  rooms: Rooms = new Rooms(this._client);
  voices: Voices = new Voices(this._client);
  speech: Speech = new Speech(this._client);
}

export * from './rooms/index.js';
export * from './voices/index.js';
