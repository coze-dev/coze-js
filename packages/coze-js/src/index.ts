import * as API from './resources/index.js';
import { APIClient } from './core.js';

export class CozeAPI extends APIClient {
  bots: API.Bots = new API.Bots(this);
  chat: API.Chat = new API.Chat(this);
  conversations: API.Conversations = new API.Conversations(this);
  files: API.Files = new API.Files(this);
  knowledge: API.Knowledge = new API.Knowledge(this);
  workflows: API.Workflows = new API.Workflows(this);
  workspaces: API.WorkSpaces = new API.WorkSpaces(this);
  audio: API.Audio = new API.Audio(this);
}
export * from './auth.js';
export * from './resources/index.js';
export * from './fetcher.js';
export * from './error.js';
export * from './constant.js';
