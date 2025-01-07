import { Runs } from './runs/index';
import { WorkflowChat } from './chat/index';
import { APIResource } from '../resource';

export class Workflows extends APIResource {
  runs: Runs = new Runs(this._client);
  chat: WorkflowChat = new WorkflowChat(this._client);
}

export * from './runs/index';
export * from './chat/index';
