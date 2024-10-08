/* eslint-disable @typescript-eslint/no-namespace */
import * as API from './resources/index.js';
import { APIClient, type ClientOptions } from './core.js';

export class CozeAPI extends APIClient {
  constructor(config: ClientOptions) {
    super(config);
  }

  bots: API.Bots = new API.Bots(this);
  chat: API.Chat = new API.Chat(this);
  conversations: API.Conversations = new API.Conversations(this);
  files: API.Files = new API.Files(this);
  knowledge: API.Knowledge = new API.Knowledge(this);
  workflows: API.Workflows = new API.Workflows(this);
  workspaces: API.Workspaces = new API.Workspaces(this);
}

export * from './auth.js';
