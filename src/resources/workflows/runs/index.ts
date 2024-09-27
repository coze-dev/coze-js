import { type Coze } from '../../../api.js';
import { APIResource } from '../../resource.js';

type RunWorkflowParams = Parameters<typeof Coze.prototype.runWorkflow>[0];
export class Runs extends APIResource {
  stream(params: RunWorkflowParams) {
    return this._client.api.runWorkflow(params);
  }
}
