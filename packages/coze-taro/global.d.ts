type TTCreateEVentSource = (args: {
  url: string;
  header?: unknown;
  method?: string;
  data?: Record<string, string>;
  timeout?: number;
}) => {
  close(): void;
  onMessage(
    cb: (msg: { data: string; event: string; lastEventId: string }) => void,
  ): void;
  onOpen(cb: () => void): void;
  onClose(cb: () => void): void;
  onError(cb: (msg: { errMsg: string }) => void): void;
};

declare namespace globalThis {
  const tt: {
    createEventSource: TTCreateEVentSource;
  };
}
