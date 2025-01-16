import {
  type ChatCreatedEvent,
  type ChatUpdatedEvent,
  type ChatUpdateEvent,
  type CommonErrorEvent,
  type ConversationAudioCompletedEvent,
  type ConversationAudioDeltaEvent,
  type ConversationChatCompletedEvent,
  type ConversationChatCreatedEvent,
  type ConversationChatFailedEvent,
  type ConversationChatInProgressEvent,
  type ConversationChatSubmitToolOutputsEvent,
  type ConversationClearedEvent,
  type ConversationClearEvent,
  type ConversationMessageCompletedEvent,
  type ConversationMessageCreateEvent,
  type ConversationMessageDeltaEvent,
  type InputAudioBufferAppendEvent,
  type InputAudioBufferClearedEvent,
  type InputAudioBufferClearEvent,
  type InputAudioBufferCompletedEvent,
  type InputAudioBufferCompleteEvent,
} from '../types.js';
import { APIResource } from '../../resource.js';
import { type WebsocketOptions } from '../../../core.js';

export class Chat extends APIResource {
  async create(botId: string, options?: WebsocketOptions) {
    const apiUrl = `/v1/chat?bot_id=${botId}`;
    return await this._client.makeWebsocket<CreateChatWsReq, CreateChatWsRes>(
      apiUrl,
      options,
    );
  }
}

export type CreateChatWsReq =
  | ChatUpdateEvent
  | InputAudioBufferAppendEvent
  | InputAudioBufferCompleteEvent
  | InputAudioBufferClearEvent
  | ConversationMessageCreateEvent
  | ConversationClearEvent
  | ConversationChatSubmitToolOutputsEvent;

export type CreateChatWsRes =
  | ChatCreatedEvent
  | ChatUpdatedEvent
  | ConversationChatCreatedEvent
  | ConversationChatInProgressEvent
  | ConversationMessageDeltaEvent
  | ConversationAudioDeltaEvent
  | ConversationMessageCompletedEvent
  | ConversationAudioCompletedEvent
  | ConversationChatCompletedEvent
  | ConversationChatFailedEvent
  | CommonErrorEvent
  | InputAudioBufferCompletedEvent
  | InputAudioBufferClearedEvent
  | ConversationClearedEvent;
