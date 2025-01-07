import { OldDocuments } from './documents/index';
import { APIResource } from '../resource';

export class Knowledge extends APIResource {
  /**
   * @deprecated
   */
  documents: OldDocuments = new OldDocuments(this._client);
}

export * from './documents/index';
