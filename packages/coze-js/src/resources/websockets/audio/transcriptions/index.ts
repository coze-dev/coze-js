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
} from '../../types.js';
import { APIResource } from '../../../resource.js';
import { type WebsocketOptions } from '../../../../core.js';

export class Transcriptions extends APIResource {
  async create(options?: WebsocketOptions) {
    const apiUrl = '/v1/audio/transcriptions';
    return await this._client.makeWebsocket<
      CreateTranscriptionsWsReq,
      CreateTranscriptionsWsRes
    >(apiUrl, options);
  }
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
