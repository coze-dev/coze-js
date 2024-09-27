/* eslint-disable @typescript-eslint/no-namespace */
import { Coze } from './api.js';
import * as API from './resources/index.js';

export interface ClientOptions {
  baseURL?: string;
  auth: API.Auth;
  fetch?: typeof fetch;
}

export class CozeAPI {
  protected _config: ClientOptions;
  api: Coze;
  baseURL: string;

  constructor(config: ClientOptions) {
    this._config = config;
    this.baseURL = config.baseURL || 'https://api.coze.com';

    this.api = new Coze({ api_key: config.auth.getToken() });
  }

  bots: API.Bots = new API.Bots(this);
  chat: API.Chat = new API.Chat(this);
  conversations: API.Conversations = new API.Conversations(this);
  files: API.Files = new API.Files(this);
  workflows: API.Workflows = new API.Workflows(this);
}

export namespace CozeAPI {
  export import Auth = API.Auth;
  export import TokenAuth = API.TokenAuth;
  export import Bots = API.Bots;
  export import Chat = API.Chat;
  export import Conversations = API.Conversations;
  export import Messages = API.Messages;
  export import Files = API.Files;
  export import Workflows = API.Workflows;
}
