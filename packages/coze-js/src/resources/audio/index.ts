import { Voices } from './voices/index';
import { Transcriptions } from './transcriptions/index';
import { Speech } from './speech/index';
import { Rooms } from './rooms/index';
import { APIResource } from '../resource';

export class Audio extends APIResource {
  rooms: Rooms = new Rooms(this._client);
  voices: Voices = new Voices(this._client);
  speech: Speech = new Speech(this._client);
  transcriptions: Transcriptions = new Transcriptions(this._client);
}

export * from './rooms/index';
export * from './voices/index';
export * from './transcriptions/index';
