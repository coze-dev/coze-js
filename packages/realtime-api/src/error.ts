export enum RealtimeError {
  DEVICE_ACCESS_ERROR = 'DEVICE_ACCESS_ERROR',
  STREAM_CREATION_ERROR = 'STREAM_CREATION_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  DISCONNECTION_ERROR = 'DISCONNECTION_ERROR',
  INTERRUPT_ERROR = 'INTERRUPT_ERROR',
  EVENT_HANDLER_ERROR = 'EVENT_HANDLER_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_STATE = 'INVALID_STATE',
  CREATE_ROOM_ERROR = 'CREATE_ROOM_ERROR',
  PARSE_MESSAGE_ERROR = 'PARSE_MESSAGE_ERROR',
  HANDLER_MESSAGE_ERROR = 'HANDLER_MESSAGE_ERROR',
}
export const ErrorMessages: Record<RealtimeError, string> = {
  [RealtimeError.DEVICE_ACCESS_ERROR]: 'Failed to get devices',
  [RealtimeError.STREAM_CREATION_ERROR]: 'Failed to create local stream',
  [RealtimeError.CONNECTION_ERROR]: 'Failed to connect',
  [RealtimeError.DISCONNECTION_ERROR]: 'Failed to disconnect',
  [RealtimeError.INTERRUPT_ERROR]: 'Failed to interrupt',
  [RealtimeError.EVENT_HANDLER_ERROR]: 'Event handler not found',
  [RealtimeError.PERMISSION_DENIED]:
    'Permission denied for requested operation',
  [RealtimeError.NETWORK_ERROR]: 'Network connection error occurred',
  [RealtimeError.INVALID_STATE]: 'Operation invalid in current state',
  [RealtimeError.CREATE_ROOM_ERROR]: 'Failed to create room',
  [RealtimeError.PARSE_MESSAGE_ERROR]: 'Failed to parse message',
  [RealtimeError.HANDLER_MESSAGE_ERROR]: 'Failed to handle message',
};

export class RealtimeAPIError extends Error {
  constructor(
    public code: RealtimeError,
    message: string,
  ) {
    super(`[${code}] ${message}`);
    this.name = 'RealtimeAPIError';
  }
}
