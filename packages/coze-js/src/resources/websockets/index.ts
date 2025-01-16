import { Chat } from './chat/index.js';
import { Audio } from './audio/index.js';
import { APIResource } from '../resource.js';

export class Websockets extends APIResource {
  audio: Audio = new Audio(this._client);
  chat: Chat = new Chat(this._client);
}

export { type CreateChatWsReq, type CreateChatWsRes } from './chat/index.js';
export {
  type CreateTranscriptionsWsReq,
  type CreateTranscriptionsWsRes,
} from './audio/transcriptions/index.js';
export {
  type CreateSpeechWsReq,
  type CreateSpeechWsRes,
} from './audio/speech/index.js';

export * from './types.js';
