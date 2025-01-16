import {
  type CommonErrorEvent,
  type InputTextBufferAppendEvent,
  type InputTextBufferCompletedEvent,
  type InputTextBufferCompleteEvent,
  type SpeechAudioCompletedEvent,
  type SpeechAudioUpdateEvent,
  type SpeechCreatedEvent,
  type SpeechUpdatedEvent,
  type SpeechUpdateEvent,
} from '../../types.js';
import { APIResource } from '../../../resource.js';
import { type WebsocketOptions } from '../../../../core.js';

export class Speech extends APIResource {
  async create(options?: WebsocketOptions) {
    const apiUrl = '/v1/audio/speech';
    return await this._client.makeWebsocket<
      CreateSpeechWsReq,
      CreateSpeechWsRes
    >(apiUrl, options);
  }
}

export type CreateSpeechWsReq =
  | SpeechUpdateEvent
  | InputTextBufferAppendEvent
  | InputTextBufferCompleteEvent;

export type CreateSpeechWsRes =
  | SpeechCreatedEvent
  | InputTextBufferCompletedEvent
  | SpeechUpdatedEvent
  | SpeechAudioUpdateEvent
  | SpeechAudioCompletedEvent
  | CommonErrorEvent;
