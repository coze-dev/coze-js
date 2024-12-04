/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
import Taro from '@tarojs/taro';
import {
  type RunWorkflowReq,
  type RequestOptions,
  WorkflowEventType,
  WorkflowEvent,
  ChatEventType,
  CozeError,
  type StreamChatReq,
  type StreamChatData,
  type CreateFileReq,
  type FileObject,
} from '@coze/api';

import { type Deferred } from '../helpers/async';
import { sendRequest } from '../event-source/request';
import { type CozeAPI } from '../api';

export interface WorkflowMessage {
  id: string;
  event: WorkflowEventType;
  data: string;
}

export interface ChatMessage {
  event: ChatEventType;
  data: string;
}

// workflows.runs.stream
export function getWorkflowStreamMixin(api: CozeAPI) {
  return async function* stream(
    params: RunWorkflowReq,
    options?: RequestOptions,
  ) {
    await refreshToken(api, params, options);

    const result: {
      messages: Array<WorkflowMessage>;
      done: boolean;
      deferred: Deferred | null;
    } = {
      messages: [],
      done: false,
      deferred: null,
    };

    sendRequest(
      {
        url: `${api.options.baseURL ?? ''}/v1/workflow/stream_run`,
        method: 'POST',
        data: params,
        headers: Object.assign(
          {
            Authorization: `Bearer ${api.options.token}`,
          },
          api.options.headers,
          options?.headers,
        ),
        signal: options?.signal,
      },
      result,
    );

    try {
      while (true) {
        if (result.done) {
          break;
        }
        if (!result.messages.length) {
          await result.deferred?.promise;
        }
        let message = result.messages.shift();
        while (message) {
          if (message.event === WorkflowEventType.DONE) {
            yield new WorkflowEvent(Number(message.id), WorkflowEventType.DONE);
          } else {
            yield new WorkflowEvent(
              Number(message.id),
              message.event,
              JSON.parse(message.data),
            );
          }
          message = result.messages.shift();
        }
      }
    } catch (e) {
      throw new CozeError(`Could not handle message: ${e}`);
    }
  };
}

// chat.stream
export function getChatStreamMixin(api: CozeAPI) {
  return async function* stream(
    params: StreamChatReq,
    options?: RequestOptions,
  ): AsyncIterable<StreamChatData> {
    await refreshToken(api, params, options);

    const result: {
      messages: Array<ChatMessage>;
      done: boolean;
      deferred: Deferred | null;
    } = {
      messages: [],
      done: false,
      deferred: null,
    };

    const { conversation_id, ...rest } = params;
    sendRequest(
      {
        url: `${api.options.baseURL ?? ''}/v3/chat${
          conversation_id ? `?conversation_id=${conversation_id}` : ''
        }`,
        method: 'POST',
        data: {
          stream: true,
          ...rest,
        },
        headers: Object.assign(
          {
            Authorization: `Bearer ${api.options.token}`,
          },
          api.options.headers,
          options?.headers,
        ),
        signal: options?.signal,
      },
      result,
    );

    try {
      while (true) {
        if (result.done) {
          break;
        }
        if (!result.messages.length) {
          await result.deferred?.promise;
        }
        let message = result.messages.shift();
        while (message) {
          if (message.event === ChatEventType.DONE) {
            yield {
              event: message.event,
              data: '[DONE]',
            };
          } else {
            yield {
              event: message.event,
              data: JSON.parse(message.data),
            };
          }
          message = result.messages.shift();
        }
      }
    } catch (e) {
      throw new CozeError(`Could not handle message: ${e}`);
    }
  };
}

// files.upload
export function getUploadFileMixin(api: CozeAPI) {
  return async (params: CreateFileReq, options?: RequestOptions) => {
    await refreshToken(api, params, options);

    return new Promise<FileObject>((resolve, reject) => {
      const task = Taro.uploadFile({
        url: `${api.options.baseURL ?? ''}/v1/files/upload`,
        header: Object.assign(
          {
            Authorization: `Bearer ${api.options.token}`,
          },
          api.options.headers,
          options?.headers,
        ),
        filePath: params.file.filePath,
        name: 'file',
        success(res) {
          if (res.statusCode !== 200) {
            reject(new Error(res.data));
          } else {
            resolve(JSON.parse(res.data).data);
          }
        },
        fail(res) {
          reject(new Error(res.errMsg));
        },
      });

      if (options?.signal) {
        options.signal.addEventListener?.('abort', () => {
          task.abort();
        });
      }
    });
  };
}

async function refreshToken(
  api: CozeAPI,
  params: unknown,
  options?: RequestOptions,
) {
  if (api.options.onBeforeAPICall) {
    const token = await api.options.onBeforeAPICall({
      ...options,
      data: params,
    });
    if (token) {
      api.options.token = token;
      api.token = token;
    }
  }
}
