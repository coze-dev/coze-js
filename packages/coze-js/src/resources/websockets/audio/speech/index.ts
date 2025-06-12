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
} from '../../types';
import { APIResource } from '../../../resource';
import { buildWebsocketUrl } from '../../../../utils';
import { type WebsocketOptions } from '../../../../core';

export class Speech extends APIResource {
  async create(req?: CreateSpeechReq, options?: WebsocketOptions) {
    const apiUrl = buildWebsocketUrl('/v1/audio/speech', req);
    return await this._client.makeWebsocket<
      CreateSpeechWsReq,
      CreateSpeechWsRes
    >(apiUrl, options);
  }
}

export interface CreateSpeechReq {
  entity_type?: 'bot' | 'workflow';
  entity_id?: string;
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
