import { OldDocuments } from './documents/index.js';
import { APIResource } from '../resource.js';

export class Knowledge extends APIResource {
  /**
   * @deprecated
   */
  documents: OldDocuments = new OldDocuments(this._client);
}

export * from './documents/index.js';
