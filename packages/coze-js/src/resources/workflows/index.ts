import { Runs } from './runs/index.js';
import { WorkflowChat } from './chat/index.js';
import { APIResource } from '../resource.js';

export class Workflows extends APIResource {
  runs: Runs = new Runs(this._client);
  chat: WorkflowChat = new WorkflowChat(this._client);
}

export * from './runs/index.js';
export * from './chat/index.js';
