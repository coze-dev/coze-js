import { APIResource } from '../../resource';
import { Transcriptions } from './transcriptions/index';
import { Speech } from './speech/index';
import { SimultInterpretation } from './simult-interpretation/index';
export * from './speech/index';
export * from './transcriptions/index';
export * from './simult-interpretation/index';

export class Audio extends APIResource {
  speech: Speech = new Speech(this._client);
  transcriptions: Transcriptions = new Transcriptions(this._client);
  simultInterpretation: SimultInterpretation = new SimultInterpretation(
    this._client,
  );
}
