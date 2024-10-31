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
