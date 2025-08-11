/**
 * WS-Tool Exports for Quick App environment
 */

// Re-export WebSocket event types from core API
export { WebsocketsEventType } from '@coze/api';

// Define custom event types for audio configuration and transmission
export enum CustomEventTypes {
  TRANSCRIPTIONS_CONFIG = 'transcriptions.config',
  TRANSCRIPTIONS_AUDIO = 'transcriptions.audio',
  TRANSCRIPTIONS_AUDIO_END = 'transcriptions.audio_end',
}

// Export WsTranscriptionClient for speech-to-text conversion
export { WsTranscriptionClient } from './transcription';

// Export PcmRecorder for audio recording
export { PcmRecorder, RecordingStatus } from './pcm-recorder';

// Export BaseWsTranscriptionClient for extending functionality
export { BaseWsTranscriptionClient } from './base';

// Export WebSocket Speech Client
export { WsSpeechClient } from './speech';
export { PcmStreamPlayer } from './pcm-stream-player';

// Export WebSocket Chat Client
export { WsChatClient } from './chat';
