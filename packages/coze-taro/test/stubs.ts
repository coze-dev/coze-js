/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
/* eslint-disable security/detect-object-injection -- ignore */

export class Events {
  private map = new Map<string, Array<Function>>();

  on(eventName: string, cb: Function) {
    const callbacks = this.map.get(eventName) ?? [];
    callbacks.push(cb);
    this.map.set(eventName, callbacks);
  }

  off(eventName?: string, cb?: Function) {
    if (eventName && cb) {
      const callbacks = (this.map.get(eventName) ?? []).filter(c => c !== cb);
      this.map.set(eventName, callbacks);
    } else if (eventName) {
      this.map.delete(eventName);
    } else {
      this.map = new Map();
    }
  }

  trigger(eventName: string, args?: unknown) {
    const callbacks = this.map.get(eventName) ?? [];
    for (const cb of callbacks) {
      try {
        cb(args);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

const mockWorkflowMessages = [
  {
    id: 0,
    event: 'Message',
    data: {
      content: 'msg',
      node_is_finish: false,
      node_seq_id: '0',
      node_title: 'Message',
    },
  },
  {
    id: 1,
    event: 'Message',
    data: {
      content: 'h',
      node_is_finish: false,
      node_seq_id: '1',
      node_title: 'Message',
    },
  },
  {
    id: 2,
    event: 'Message',
    data: {
      content: 'ello',
      node_is_finish: false,
      node_seq_id: '2',
      node_title: 'Message',
    },
  },
  {
    id: 3,
    event: 'Done',
    data: {},
  },
];

class TTTask {
  events = new Events();
  closed = false;

  onOpen(cb: () => void) {
    this.events.on('open', cb);
  }

  onMessage(
    cb: (msg: { data: string; event: string; lastEventId: string }) => void,
  ) {
    this.events.on('message', cb);
  }

  onError(cb: (msg: { errMsg: string }) => void) {
    this.events.on('error', cb);
  }

  onClose(cb: () => void) {
    this.events.on('close', cb);
  }

  close() {
    this.closed = true;
  }
}

class TaroStreamingTask {
  events = new Events();
  closed = false;

  onHeadersReceived(cb: () => void) {
    this.events.on('headersReceived', cb);
  }

  onChunkReceived(cb: (msg: { data: string }) => void) {
    this.events.on('chunkReceived', cb);
  }

  abort() {
    this.closed = true;
  }
}

function encodeData(text: string): string {
  const data = String(text).replace(/(\r\n|\r|\n)/g, '\n');
  const lines = data.split(/\n/);

  let line = '';
  let output = '';
  for (let i = 0, l = lines.length; i < l; ++i) {
    line = lines[i];
    output += `data: ${line}`;
    output += i + 1 === l ? '\n\n' : '\n';
  }
  return output;
}

function toSSEEvent(msg: {
  event: string;
  id: number;
  data: Record<string, unknown>;
}): ArrayBuffer {
  let output = '';
  if (msg.event) {
    output += `event: ${msg.event}\n`;
  }
  if (typeof msg.id === 'number') {
    output += `id: ${msg.id}\n`;
  }
  output += encodeData(JSON.stringify(msg.data));
  const encoder = new TextEncoder();
  return encoder.encode(output).buffer;
}

export const ttCreateEventSource: TTCreateEVentSource = () => {
  const task = new TTTask();

  let index = 0;
  const mockReceiveMessage = () => {
    if (index < mockWorkflowMessages.length && !task.closed) {
      setTimeout(() => {
        task.events.trigger('message', {
          data: JSON.stringify(mockWorkflowMessages[index]),
        });
        index++;
        mockReceiveMessage();
      }, 10);
    } else if (index === mockWorkflowMessages.length) {
      task.events.trigger('close');
    } else {
      task.events.trigger('error', { errMsg: 'err' });
    }
  };

  setTimeout(() => {
    task.events.trigger('open');
    mockReceiveMessage();
  }, 0);

  return task;
};

export const taroStreamingRequest = ({
  fail,
  success,
}: {
  fail: (err: { errMsg: string }) => void;
  success: (res: { statusCode: number; errMsg?: string }) => void;
}) => {
  const task = new TaroStreamingTask();

  let index = 0;
  const mockReceiveMessage = () => {
    if (index < mockWorkflowMessages.length && !task.closed) {
      setTimeout(() => {
        task.events.trigger('chunkReceived', {
          data: toSSEEvent(mockWorkflowMessages[index]),
        });
        index++;
        mockReceiveMessage();
      }, 10);
    } else if (index === mockWorkflowMessages.length) {
      success({ statusCode: 200 });
    } else {
      fail({ errMsg: 'err' });
    }
  };

  setTimeout(() => {
    task.events.trigger('headersReceived');
    mockReceiveMessage();
  }, 0);

  return task;
};
