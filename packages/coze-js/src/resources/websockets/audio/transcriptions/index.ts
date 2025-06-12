import {
  type TranscriptionsUpdateEvent,
  type InputAudioBufferAppendEvent,
  type InputAudioBufferCompleteEvents,
  type InputAudioBufferClearEvent,
  type TranscriptionsCreatedEvent,
  type TranscriptionsUpdatedEvent,
  type InputAudioBufferCompletedEvent,
  type InputAudioBufferClearedEvent,
  type TranscriptionsMessageUpdateEvent,
  type TranscriptionsMessageCompletedEvent,
  type CommonErrorEvent,
} from '../../types';
import { APIResource } from '../../../resource';
import { buildWebsocketUrl } from '../../../../utils';
import { type WebsocketOptions } from '../../../../core';

export class Transcriptions extends APIResource {
  async create(req?: CreateTranscriptionsReq, options?: WebsocketOptions) {
    const apiUrl = buildWebsocketUrl('/v1/audio/transcriptions', req);
    return await this._client.makeWebsocket<
      CreateTranscriptionsWsReq,
      CreateTranscriptionsWsRes
    >(apiUrl, options);
  }
}

export interface CreateTranscriptionsReq {
  entity_type?: 'bot' | 'workflow';
  entity_id?: string;
}

export type CreateTranscriptionsWsReq =
  | TranscriptionsUpdateEvent
  | InputAudioBufferAppendEvent
  | InputAudioBufferCompleteEvents
  | InputAudioBufferClearEvent;

export type CreateTranscriptionsWsRes =
  | TranscriptionsCreatedEvent
  | TranscriptionsUpdatedEvent
  | InputAudioBufferCompletedEvent
  | InputAudioBufferClearedEvent
  | TranscriptionsMessageUpdateEvent
  | TranscriptionsMessageCompletedEvent
  | CommonErrorEvent;
