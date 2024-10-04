import { APIResource } from '../resource.js';
import { Documents } from './documents/index.js';

export class Knowledge extends APIResource {
  documents: Documents = new Documents(this._client);
}

export * from './documents/index.js';
