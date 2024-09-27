import { type Coze } from '../../../api.js';
import { APIResource } from '../../resource.js';

type CreateMessageParams = Parameters<typeof Coze.prototype.createMessage>[0];
type UpdateMessageParams = Parameters<typeof Coze.prototype.updateMessage>[0];
type RetrieveMessageParams = Parameters<typeof Coze.prototype.readMessage>[0];
type ListMessageParams = Parameters<typeof Coze.prototype.listMessages>[0];

export class Messages extends APIResource {
  create(params: CreateMessageParams) {
    return this._client.api.createMessage(params);
  }

  update(params: UpdateMessageParams) {
    return this._client.api.updateMessage(params);
  }

  retrieve(params: RetrieveMessageParams) {
    return this._client.api.readMessage(params);
  }

  list(params: ListMessageParams) {
    return this._client.api.listMessages(params);
  }
}
