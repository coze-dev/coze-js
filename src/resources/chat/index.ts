import { type Coze } from '../../api.js';
import { APIResource } from '../resource.js';

type CreateChatParams = Parameters<typeof Coze.prototype.chatV3>[0];
type StreamChatParams = Parameters<typeof Coze.prototype.chatV3Streaming>[0];
type RetrieveChatParams = Parameters<typeof Coze.prototype.getChat>[0];
type HistoryChatParams = Parameters<typeof Coze.prototype.getChatHistory>[0];
type SubmitToolOutputsParams = Parameters<typeof Coze.prototype.submitToolOutputs>[0];

export class Chat extends APIResource {
  create(params: CreateChatParams) {
    return this._client.api.chatV3(params);
  }

  stream(params: StreamChatParams) {
    return this._client.api.chatV3Streaming(params);
  }

  retrieve(params: RetrieveChatParams) {
    return this._client.api.getChat(params);
  }

  history(params: HistoryChatParams) {
    return this._client.api.getChatHistory(params);
  }

  submitToolOutputs(params: SubmitToolOutputsParams) {
    return this._client.api.submitToolOutputs(params);
  }
}
