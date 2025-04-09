import * as API from './resources/index';
import { APIClient } from './core';

export class CozeAPI extends APIClient {
  bots: API.Bots = new API.Bots(this);
  chat: API.Chat = new API.Chat(this);
  conversations: API.Conversations = new API.Conversations(this);
  files: API.Files = new API.Files(this);
  /**
   * @deprecated
   */
  knowledge: API.Knowledge = new API.Knowledge(this);
  datasets: API.Datasets = new API.Datasets(this);
  workflows: API.Workflows = new API.Workflows(this);
  workspaces: API.WorkSpaces = new API.WorkSpaces(this);
  audio: API.Audio = new API.Audio(this);
  templates: API.Templates = new API.Templates(this);
  websockets: API.Websockets = new API.Websockets(this);
}
export { type ClientOptions, type RequestOptions, type GetToken } from './core';
export * from './auth';
export * from './resources/index';
export * from './fetcher';
export * from './error';
export * from './constant';
export { WebSocketAPI } from './websocket-api';
