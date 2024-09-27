import { type Coze } from '../../api.js';
import { APIResource } from '../resource.js';

type CreateFileParams = Parameters<typeof Coze.prototype.uploadFile>[0];
type RetrieveFileParams = Parameters<typeof Coze.prototype.readFileMeta>[0];

export class Files extends APIResource {
  create(params: CreateFileParams) {
    return this._client.api.uploadFile(params);
  }

  retrieve(params: RetrieveFileParams) {
    return this._client.api.readFileMeta(params);
  }
}
