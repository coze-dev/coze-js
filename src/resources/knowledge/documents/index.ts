import { type Coze } from '../../../api.js';
import { APIResource } from '../../resource.js';

type ListBotParams = Parameters<typeof Coze.prototype.listKnowledge>[0];
type CreateBotParams = Parameters<typeof Coze.prototype.createKnowledgeDocument>[0];
type DeleteBotParams = Parameters<typeof Coze.prototype.deleteKnowledgeDocument>[0];
type UpdateBotParams = Parameters<typeof Coze.prototype.updateKnowledgeDocument>[0];

export class Documents extends APIResource {
  list(params: ListBotParams) {
    return this._client.api.listKnowledge(params);
  }

  create(params: CreateBotParams) {
    return this._client.api.createKnowledgeDocument(params);
  }

  delete(params: DeleteBotParams) {
    return this._client.api.deleteKnowledgeDocument(params);
  }

  update(params: UpdateBotParams) {
    return this._client.api.updateKnowledgeDocument(params);
  }
}
