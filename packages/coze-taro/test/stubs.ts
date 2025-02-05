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
  reason: string | undefined = '';

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

  close(reason?: string) {
    this.closed = true;
    this.reason = reason;
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
}): { whole: ArrayBuffer; parts: ArrayBuffer[] } {
  let output = '';
  if (msg.event) {
    output += `event: ${msg.event}\n`;
  }
  if (typeof msg.id === 'number') {
    output += `id: ${msg.id}\n`;
  }

  output += encodeData(JSON.stringify(msg.data));
  const split = Math.floor(output.length / 2);
  const parts = [output.slice(0, split), output.slice(split)];

  const encoder = new TextEncoder();
  return {
    whole: encoder.encode(output).buffer,
    parts: [encoder.encode(parts[0]).buffer, encoder.encode(parts[1]).buffer],
  };
}

export const ttCreateEventSource: TTCreateEVentSource = ({ data, timeout }) => {
  const task = new TTTask();

  let index = 0;
  const mockReceiveMessage = () => {
    if (data && data.workflow_id && data.workflow_id === 'fail') {
      setTimeout(() => {
        task.events.trigger('message', {
          data: 'invalid json',
        });
      }, 10);
    } else if (index < mockWorkflowMessages.length && !task.closed) {
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
      task.events.trigger('error', { errMsg: task.reason ?? 'err' });
    }
  };

  setTimeout(() => {
    task.events.trigger('open');
    mockReceiveMessage();
    if (timeout) {
      setTimeout(() => {
        task.close('timeout');
      }, timeout);
    }
  }, 0);

  return task;
};

export const taroRequest = ({
  data,
  timeout,
  fail,
  success,
}: {
  data?: Record<string, unknown>;
  timeout?: number;
  fail: (err: { errMsg: string }) => void;
  success: (res: { statusCode: number; errMsg?: string }) => void;
}) => {
  if (data?.workflow_id === 'nonStreaming') {
    return Promise.resolve({ statusCode: 200 });
  }

  const task = new TaroStreamingTask();

  let index = 0;
  const mockReceiveMessage = () => {
    if (data && data.workflow_id && data.workflow_id === 'fail') {
      setTimeout(() => {
        fail({ errMsg: 'fail' });
      }, 10);
    } else if (index < mockWorkflowMessages.length && !task.closed) {
      setTimeout(() => {
        if (index === 2) {
          // mock long message split
          const { parts } = toSSEEvent(mockWorkflowMessages[index]);
          parts.forEach(part => {
            task.events.trigger('chunkReceived', {
              data: part,
            });
          });
        } else {
          task.events.trigger('chunkReceived', {
            data: toSSEEvent(mockWorkflowMessages[index]).whole,
          });
        }

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
    if (timeout) {
      setTimeout(() => {
        task.abort();
      }, timeout);
    }
  }, 0);

  return task;
};

export const taroUploadFile = ({
  success,
}: {
  fail: (err: { errMsg: string }) => void;
  success: (res: { statusCode: number; data: string }) => void;
}) => {
  success({
    statusCode: 200,
    data: JSON.stringify({ data: { mock: 'xx' } }),
  });
};
