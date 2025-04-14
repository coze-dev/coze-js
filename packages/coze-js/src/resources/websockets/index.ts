import { Chat } from './chat/index';
import { Audio } from './audio/index';
import { APIResource } from '../resource';

export class Websockets extends APIResource {
  audio: Audio = new Audio(this._client);
  chat: Chat = new Chat(this._client);
}

export { type CreateChatWsReq, type CreateChatWsRes } from './chat/index';

export {
  type CreateTranscriptionsWsReq,
  type CreateTranscriptionsWsRes,
} from './audio/transcriptions/index';

export {
  type CreateSpeechWsReq,
  type CreateSpeechWsRes,
} from './audio/speech/index';

export {
  type CreateSimultInterpretationsWsReq,
  type CreateSimultInterpretationsWsRes,
} from './audio/simult-interpretation/index';

export * from './types';
