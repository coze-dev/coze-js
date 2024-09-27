import { type Coze } from '../../api.js';
import { APIResource } from '../resource.js';
import { Messages } from './messages/index.js';

type CreateConversationParams = Parameters<typeof Coze.prototype.createConversation>[0];
type RetrieveConversationParams = Parameters<typeof Coze.prototype.getConversation>[0];

export class Conversations extends APIResource {
  create(params: CreateConversationParams) {
    return this._client.api.createConversation(params);
  }

  retrieve(params: RetrieveConversationParams) {
    return this._client.api.getConversation(params);
  }

  messages: Messages = new Messages(this._client);
}

export * from './messages/index.js';
