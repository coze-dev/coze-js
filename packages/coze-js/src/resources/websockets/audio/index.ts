import { APIResource } from '../../resource.js';
import { Transcriptions } from './transcriptions/index.js';
import { Speech } from './speech/index.js';

export * from './speech/index.js';
export * from './transcriptions/index.js';

export class Audio extends APIResource {
  speech: Speech = new Speech(this._client);
  transcriptions: Transcriptions = new Transcriptions(this._client);
}
