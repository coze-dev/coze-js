import { type Coze } from '../../api.js';
import { APIResource } from '../resource.js';

type ListBotParams = Parameters<typeof Coze.prototype.listBots>[0];
type RetrieveBotParams = Parameters<typeof Coze.prototype.getBotInfo>[0];

export class Bots extends APIResource {
  create() {}

  update() {}

  list(params: ListBotParams) {
    return this._client.api.listBots(params);
  }

  retrieve(params: RetrieveBotParams) {
    return this._client.api.getBotInfo(params);
  }
}
