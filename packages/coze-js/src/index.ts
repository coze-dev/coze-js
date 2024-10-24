import * as API from './resources/index.js';
import { APIClient } from './core.js';

export class CozeAPI extends APIClient {
  bots: API.Bots = new API.Bots(this);
  chat: API.Chat = new API.Chat(this);
  conversations: API.Conversations = new API.Conversations(this);
  files: API.Files = new API.Files(this);
  knowledge: API.Knowledge = new API.Knowledge(this);
  workflows: API.Workflows = new API.Workflows(this);
  workspaces: API.Workspaces = new API.Workspaces(this);
  audio: API.Audio = new API.Audio(this);
}
export {
  getOAuthToken,
  getPKCEOAuthToken,
  getAuthenticationUrl,
  getPKCEAuthenticationUrl,
  OAuthTokenData,
  refreshOAuthToken,
  getDeviceCode,
  getDeviceToken,
  DeviceCodeData,
  DeviceTokenData,
  getJWTToken,
} from './auth.js';
export * from './resources/index.js';
export * from './fetcher.js';
export * from './error.js';
