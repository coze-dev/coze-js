/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
/* eslint-disable security/detect-object-injection -- ignore */
import { Events } from '@tarojs/taro';

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
      task.events.trigger('error');
    }
  };

  setTimeout(() => {
    task.events.trigger('open');
    mockReceiveMessage();
  }, 0);

  return task;
};
