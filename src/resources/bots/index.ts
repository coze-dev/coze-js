import { type Coze } from '../../api.js';
import { APIResource } from '../resource.js';

type ListBotParams = Parameters<typeof Coze.prototype.listBots>[0];
type RetrieveBotParams = Parameters<typeof Coze.prototype.getBotInfo>[0];
type CreateBotParams = Parameters<typeof Coze.prototype.createBot>[0];
type UpdateBotParams = Parameters<typeof Coze.prototype.updateBot>[0];
type PublishBotParams = Parameters<typeof Coze.prototype.publishBot>[0];
export class Bots extends APIResource {
  create(params: CreateBotParams) {
    return this._client.api.createBot(params);
  }

  update(params: UpdateBotParams) {
    return this._client.api.updateBot(params);
  }

  publish(params: PublishBotParams) {
    return this._client.api.publishBot(params);
  }

  list(params: ListBotParams) {
    return this._client.api.listBots(params);
  }

  retrieve(params: RetrieveBotParams) {
    return this._client.api.getBotInfo(params);
  }
}
