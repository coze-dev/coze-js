type TTCreateEVentSource = (args: {
  url: string;
  header?: unknown;
  method?: string;
  data?: Record<string, string>;
}) => {
  close(): void;
  onMessage(
    cb: (msg: { data: string; event: string; lastEventId: string }) => void,
  ): void;
  onOpen(cb: () => void): void;
  onClose(cb: () => void): void;
  onError(cb: (msg: { errMsg: string }) => void): void;
};

declare module globalThis {
  const tt: {
    createEventSource: TTCreateEVentSource;
  };
}
