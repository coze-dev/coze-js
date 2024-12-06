export interface NotificationMessage {
  title: string;
  content: string;
  url?: string;
  creator?: string;
  additionalData?: Record<string, unknown>;
}

export interface NotificationPlatform {
  send: (message: NotificationMessage) => Promise<void>;
}
