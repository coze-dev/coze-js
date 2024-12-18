import { Documents } from './documents/index.js';
import { APIResource } from '../resource.js';

export class Datasets extends APIResource {
  documents: Documents = new Documents(this._client);
}

export * from './documents/index.js';
