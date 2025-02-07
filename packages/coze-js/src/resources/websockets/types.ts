// Common types (not exported)
interface BaseEvent {
  /** Client/Server generated unique ID */
  id: string;
  /** Event type */
  event_type: WebsocketsEventType;
}

type BaseEventWithDetail = BaseEvent & {
  /** Detailed information object */
  detail: EventDetail;
};

interface ChatData {
  /** Chat ID */
  id: string;
  /** Conversation ID */
  conversation_id: string;
  /** Bot ID for the chat */
  bot_id: string;
  /** Chat creation time (Unix timestamp in seconds) */
  created_at?: number;
  /** Error information if chat fails */
  last_error?: {
    code: number;
    msg: string;
  };
  /** Additional metadata */
  meta_data?: Record<string, string>;
  /** Chat status */
  status?: string;
  /** Usage statistics */
  usage?: {
    token_count?: number;
    output_count?: number;
    input_count?: number;
  };
}

interface MessageData {
  /** Message ID */
  id: string;
  /** Conversation ID */
  conversation_id: string;
  /** Bot ID */
  bot_id: string;
  /** Chat ID */
  chat_id: string;
  /** Additional metadata */
  meta_data: Record<string, string>;
  /** Message sender role */
  role: 'user' | 'assistant';
  /** Message content */
  content: string;
  /** Content type */
  content_type: 'text' | 'object_string' | 'card' | 'audio';
  /** Message type */
  type:
    | 'question'
    | 'answer'
    | 'function_call'
    | 'tool_output'
    | 'tool_response'
    | 'follow_up'
    | 'verbose';
}

// Keep all existing exports but use the base types where applicable
export enum WebsocketsEventType {
  // Common
  /** SDK error */
  CLIENT_ERROR = 'client_error',
  /** Connection closed */
  CLOSED = 'closed',

  // Error
  /** Received error event */
  ERROR = 'error',

  // v1/audio/speech
  /** Send text to server */
  INPUT_TEXT_BUFFER_APPEND = 'input_text_buffer.append',
  /** No text to send, after audio all received, can close connection */
  INPUT_TEXT_BUFFER_COMPLETE = 'input_text_buffer.complete',
  /** Send speech config to server */
  SPEECH_UPDATE = 'speech.update',
  /** Received `speech.updated` event */
  SPEECH_UPDATED = 'speech.updated',
  /** After speech created */
  SPEECH_CREATED = 'speech.created',
  /** Received `input_text_buffer.complete` event */
  INPUT_TEXT_BUFFER_COMPLETED = 'input_text_buffer.completed',
  /** Received `speech.update` event */
  SPEECH_AUDIO_UPDATE = 'speech.audio.update',
  /** All audio received, can close connection */
  SPEECH_AUDIO_COMPLETED = 'speech.audio.completed',

  // v1/audio/transcriptions
  /** Send audio to server */
  INPUT_AUDIO_BUFFER_APPEND = 'input_audio_buffer.append',
  /** No audio to send, after text all received, can close connection */
  INPUT_AUDIO_BUFFER_COMPLETE = 'input_audio_buffer.complete',
  /** Send transcriptions config to server */
  TRANSCRIPTIONS_UPDATE = 'transcriptions.update',
  /** Send `input_audio_buffer.clear` event */
  INPUT_AUDIO_BUFFER_CLEAR = 'input_audio_buffer.clear', // TODO add
  /** After transcriptions created */
  TRANSCRIPTIONS_CREATED = 'transcriptions.created',
  /** Received `input_audio_buffer.complete` event */
  INPUT_AUDIO_BUFFER_COMPLETED = 'input_audio_buffer.completed',
  /** Received `transcriptions.update` event */
  TRANSCRIPTIONS_MESSAGE_UPDATE = 'transcriptions.message.update',
  /** All audio received, can close connection */
  TRANSCRIPTIONS_MESSAGE_COMPLETED = 'transcriptions.message.completed',
  /** Received `input_audio_buffer.cleared` event */
  INPUT_AUDIO_BUFFER_CLEARED = 'input_audio_buffer.cleared', // TODO add
  /** Received `transcriptions.updated` event */
  TRANSCRIPTIONS_UPDATED = 'transcriptions.updated', // TODO add

  // v1/chat
  /** Send chat config to server */
  CHAT_UPDATE = 'chat.update',
  /** Send tool outputs to server */
  CONVERSATION_CHAT_SUBMIT_TOOL_OUTPUTS = 'conversation.chat.submit_tool_outputs',
  /** After chat created */
  CHAT_CREATED = 'chat.created',
  /** After chat updated */
  CHAT_UPDATED = 'chat.updated',
  /** Audio AST completed, chat started */
  CONVERSATION_CHAT_CREATED = 'conversation.chat.created',
  /** Message created */
  CONVERSATION_MESSAGE_CREATE = 'conversation.message.create', // TODO add
  /** Clear conversation */
  CONVERSATION_CLEAR = 'conversation.clear', // TODO add
  /** Chat in progress */
  CONVERSATION_CHAT_IN_PROGRESS = 'conversation.chat.in_progress',
  /** Get agent text message update */
  CONVERSATION_MESSAGE_DELTA = 'conversation.message.delta',
  /** Need plugin submit */
  CONVERSATION_CHAT_REQUIRES_ACTION = 'conversation.chat.requires_action',
  /** Message completed */
  CONVERSATION_MESSAGE_COMPLETED = 'conversation.message.completed',
  /** Get agent audio message update */
  CONVERSATION_AUDIO_DELTA = 'conversation.audio.delta',
  /** Audio message completed */
  CONVERSATION_AUDIO_COMPLETED = 'conversation.audio.completed',
  /** All message received, can close connection */
  CONVERSATION_CHAT_COMPLETED = 'conversation.chat.completed',
  /** Chat failed */
  CONVERSATION_CHAT_FAILED = 'conversation.chat.failed', // TODO add
  /** Received `conversation.cleared` event */
  CONVERSATION_CLEARED = 'conversation.cleared', // TODO add
}

export interface EventDetail {
  /** Log ID for this request. If you encounter errors and repeated retries fail, you can contact the Coze team with this logid and error code for assistance. */
  logid: string;
}

export interface CommonErrorEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.ERROR;
  data: {
    code: number;
    msg: string;
  };
}

interface AudioConfig {
  /** Input audio format, supports pcm/wav/ogg */
  format?: 'pcm' | 'wav' | 'ogg';
  /** Input audio codec, supports pcm/opus */
  codec?: 'pcm' | 'opus';
  /** Input audio sample rate, default 24000 */
  sample_rate?: number;
  /** Number of audio channels, default 1 (mono) */
  channel?: number;
  /** Audio bit depth, default 16 */
  bit_depth?: number;
}

interface ChatConfig {
  /** Additional information, typically used for business-related fields */
  meta_data?: Record<string, string>;
  /** Variables defined in the agent */
  custom_variables?: Record<string, string>;
  /** Additional parameters for special scenarios */
  extra_params?: {
    latitude?: string;
    longitude?: string;
  };
  /** User identifier */
  user_id?: string;
  /** Conversation identifier */
  conversation_id?: string;
  /** Whether to save conversation history */
  auto_save_history?: boolean;
}

export interface ChatUpdateEvent extends BaseEvent {
  event_type: WebsocketsEventType.CHAT_UPDATE;
  data?: {
    chat_config?: ChatConfig;
    input_audio?: AudioConfig;
    output_audio?: OutputAudio;
  };
}

export interface ChatUpdatedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CHAT_UPDATED;
  data: {
    chat_config: Required<ChatConfig>;
    input_audio: Required<AudioConfig>;
    output_audio: Required<OutputAudio>;
  };
}

export interface ConversationChatInProgressEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_CHAT_IN_PROGRESS;
  data: ChatData;
}

export interface ConversationChatCompletedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_CHAT_COMPLETED;
  data: ChatData & {
    completed_at?: number;
  };
}

export interface ConversationChatFailedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_CHAT_FAILED;
  data: ChatData & {
    failed_at?: number;
  };
}

export interface ConversationMessageCreateEvent extends BaseEvent {
  event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE;
  data: {
    role: 'user' | 'assistant';
    content_type: 'text' | 'object_string';
    content: string;
  };
}

export interface ConversationAudioDeltaEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_AUDIO_DELTA;
  data: Omit<MessageData, 'content_type'> & {
    content_type: 'audio';
  };
}

export interface ConversationAudioCompletedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_AUDIO_COMPLETED;
  data: Omit<MessageData, 'content_type' | 'content'> & {
    content_type: 'audio';
    content: string;
  };
}

// Audio related base types
interface AudioBuffer {
  /** Base64 encoded audio data */
  delta: string;
}

export interface InputAudioBufferAppendEvent extends BaseEvent {
  event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND;
  data: AudioBuffer;
}

export interface InputAudioBufferCompleteEvent extends BaseEvent {
  event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE;
}

export interface TranscriptionsUpdateEvent extends BaseEvent {
  event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATE;
  data: {
    input_audio?: AudioConfig;
  };
}

export interface TranscriptionsCreatedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.TRANSCRIPTIONS_CREATED;
}

export interface InputAudioBufferCompletedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETED;
}

export interface TranscriptionsMessageUpdateEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE;
  data: MessageData;
}

export interface TranscriptionsMessageCompletedEvent
  extends BaseEventWithDetail {
  event_type: WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_COMPLETED;
  data: {
    content: string;
  };
}

export interface InputAudioBufferClearedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_CLEARED;
}

export interface TranscriptionsUpdatedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATED;
  data: {
    input_audio: Required<AudioConfig>;
  };
}

export interface InputTextBufferAppendEvent extends BaseEvent {
  event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_APPEND;
  data: {
    delta: string;
  };
}

export interface InputTextBufferCompleteEvent extends BaseEvent {
  event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETE;
}

export interface SpeechUpdateEvent extends BaseEvent {
  event_type: WebsocketsEventType.SPEECH_UPDATE;
  data?: {
    output_audio?: OutputAudio;
  };
}

export interface SpeechUpdatedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.SPEECH_UPDATED;
  data: {
    output_audio: Required<OutputAudio>;
  };
}

export interface SpeechCreatedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.SPEECH_CREATED;
}

export interface InputTextBufferCompletedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETED;
}

export interface SpeechAudioUpdateEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.SPEECH_AUDIO_UPDATE;
  data: {
    delta: string;
  };
}

export interface SpeechAudioCompletedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.SPEECH_AUDIO_COMPLETED;
}

// Common events
export interface ClientErrorEvent extends BaseEvent {
  event_type: WebsocketsEventType.CLIENT_ERROR;
  data: {
    code: number;
    msg: string;
  };
}

export interface ClosedEvent extends BaseEvent {
  event_type: WebsocketsEventType.CLOSED;
}

export interface ConversationClearEvent extends BaseEvent {
  event_type: WebsocketsEventType.CONVERSATION_CLEAR;
}

export interface ConversationClearedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_CLEARED;
}

export interface ChatCreatedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CHAT_CREATED;
}

export interface ConversationChatCreatedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_CHAT_CREATED;
  data: ChatData;
}

export interface ConversationChatSubmitToolOutputsEvent extends BaseEvent {
  event_type: WebsocketsEventType.CONVERSATION_CHAT_SUBMIT_TOOL_OUTPUTS;
  data: {
    chat_id: string;
    tool_outputs: {
      tool_call_id: string;
      output: string;
    }[];
  };
}

export interface ConversationMessageCompletedEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_MESSAGE_COMPLETED;
  data: MessageData;
}

export interface ConversationMessageDeltaEvent extends BaseEventWithDetail {
  event_type: WebsocketsEventType.CONVERSATION_MESSAGE_DELTA;
  data: MessageData;
}

export interface InputAudioBufferClearEvent extends BaseEvent {
  event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_CLEAR;
}

export interface InputAudioBufferCompleteEvents extends BaseEvent {
  event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE;
}

interface OutputAudio {
  /** Output audio codec */
  codec?: 'pcm' | 'opus';
  pcm_config?: {
    sample_rate?: number;
  };
  speech_rate?: number;
  voice_id?: string;
}
