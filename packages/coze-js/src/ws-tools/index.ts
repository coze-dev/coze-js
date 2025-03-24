import { type WebsocketOptions } from '../core';
import { type GetToken } from '..';
import * as WsToolsUtils from './utils';

export interface WsToolsOptions {
  /** Personal Access Token (PAT) or OAuth2.0 token, or a function to get token */
  token: GetToken;
  /** Whether to enable debug mode */
  debug?: boolean;
  /** Custom headers */
  headers?: Headers | Record<string, unknown>;
  /** Whether Personal Access Tokens (PAT) are allowed in browser environments */
  allowPersonalAccessTokenInBrowser?: boolean;
  /** base websocket URL, default is wss://ws.coze.cn */
  baseWsURL?: string;
  /** websocket options */
  websocketOptions?: WebsocketOptions;
}

export { default as WsSpeechClient } from './speech';
export { default as WsTranscriptionClient } from './transcription';
export { default as WsChatClient, WsChatEventNames } from './chat';
export {
  type WsChatEventData,
  type WsChatCallbackHandler,
  type AudioRecordEvent,
} from './chat/types';
export {
  default as PcmRecorder,
  AIDenoiserProcessorMode,
  AIDenoiserProcessorLevel,
} from './recorder/pcm-recorder';

export { WsToolsUtils };
