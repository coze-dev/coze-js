import {
  type InputAudioBufferAppendEvent,
  type CommonErrorEvent,
  type SimultInterpretationUpdateEvent,
  type SimultInterpretationCreatedEvent,
  type SimultInterpretationUpdatedEvent,
  type SimultInterpretationAudioDeltaEvent,
  type SimultInterpretationTranscriptionDeltaEvent,
  type SimultInterpretationMessageCompletedEvent,
  type InputAudioBufferCompleteEvent,
  type InputAudioBufferCompletedEvent,
} from '../../types';
import { APIResource } from '../../../resource';
import { type WebsocketOptions } from '../../../../core';

export class SimultInterpretation extends APIResource {
  async create(options?: WebsocketOptions) {
    const apiUrl = '/v1/audio/simult_interpretation';
    return await this._client.makeWebsocket<
      CreateSimultInterpretationsWsReq,
      CreateSimultInterpretationsWsRes
    >(apiUrl, options);
  }
}

export type CreateSimultInterpretationsWsReq =
  | SimultInterpretationUpdateEvent
  | InputAudioBufferAppendEvent
  | InputAudioBufferCompleteEvent;

export type CreateSimultInterpretationsWsRes =
  | SimultInterpretationCreatedEvent
  | SimultInterpretationUpdatedEvent
  | SimultInterpretationAudioDeltaEvent
  | SimultInterpretationTranscriptionDeltaEvent
  | InputAudioBufferCompletedEvent
  | SimultInterpretationMessageCompletedEvent
  | CommonErrorEvent;
