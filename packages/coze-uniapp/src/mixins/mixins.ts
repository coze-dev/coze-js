/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
import {
  type RunWorkflowReq,
  type RequestOptions,
  WorkflowEventType,
  WorkflowEvent,
  ChatEventType,
  type StreamChatReq,
  type StreamChatData,
  type CreateFileReq,
  type ChatWorkflowReq,
  type FileObject,
  type EnterMessage,
  type ObjectStringItem,
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

const uuid = () => {
  const array = new Uint32Array(1);
  uni.getRandomValues(array);
  return (array[0] * new Date().getTime()).toString();
};

export const handleAdditionalMessages = (
  additional_messages?: EnterMessage[],
) =>
  additional_messages?.map(i => ({
    ...i,
    content:
      typeof i.content === 'object' ? JSON.stringify(i.content) : i.content,
  }));

export const handleParameters = (
  parameters?: Record<string, ObjectStringItem | string>,
) => {
  if (parameters) {
    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'object') {
        parameters[key] = JSON.stringify(value);
      }
    }
  }
  return parameters;
};

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
      error: Error | null;
    } = {
      messages: [],
      done: false,
      deferred: null,
      error: null,
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
        timeout: options?.timeout ?? api.axiosOptions?.timeout,
      },
      result,
    );

    while (true) {
      if (result.done) {
        break;
      }
      if (!result.messages.length) {
        await result.deferred?.promise;
        if (result.error) {
          throw result.error;
        }
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
      error: Error | null;
    } = {
      messages: [],
      done: false,
      deferred: null,
      error: null,
    };

    if (!params.user_id) {
      params.user_id = uuid();
    }

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
          additional_messages: handleAdditionalMessages(
            params.additional_messages,
          ),
          shortcut_command: params.shortcut_command
            ? {
                ...params.shortcut_command,
                parameters: handleParameters(
                  params.shortcut_command.parameters,
                ),
              }
            : undefined,
        },
        headers: Object.assign(
          {
            Authorization: `Bearer ${api.options.token}`,
          },
          api.options.headers,
          options?.headers,
        ),
        signal: options?.signal,
        timeout: options?.timeout ?? api.axiosOptions?.timeout,
      },
      result,
    );

    yield* handleStreamMessages(result);
  };
}

// workflows.chat.stream
export function getWorkflowChatStreamMixin(api: CozeAPI) {
  return async function* stream(
    params: ChatWorkflowReq,
    options?: RequestOptions,
  ): AsyncIterable<StreamChatData> {
    await refreshToken(api, params, options);

    const result: {
      messages: Array<ChatMessage>;
      done: boolean;
      deferred: Deferred | null;
      error: Error | null;
    } = {
      messages: [],
      done: false,
      deferred: null,
      error: null,
    };

    sendRequest(
      {
        url: `${api.options.baseURL ?? ''}/v1/workflows/chat`,
        method: 'POST',
        data: {
          ...params,
          additional_messages: handleAdditionalMessages(
            params.additional_messages,
          ),
        },
        headers: Object.assign(
          {
            Authorization: `Bearer ${api.options.token}`,
          },
          api.options.headers,
          options?.headers,
        ),
        signal: options?.signal,
        timeout: options?.timeout ?? api.axiosOptions?.timeout,
      },
      result,
    );

    yield* handleStreamMessages(result);
  };
}

// files.upload
export function getUploadFileMixin(api: CozeAPI) {
  return async (params: CreateFileReq, options?: RequestOptions) => {
    await refreshToken(api, params, options);

    return new Promise<FileObject>((resolve, reject) => {
      const task = uni.uploadFile({
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
        timeout: options?.timeout ?? api.axiosOptions?.timeout,
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
    const config =
      (await api.options.onBeforeAPICall({
        ...options,
        data: params,
      })) ?? {};
    if (config.token) {
      api.options.token = config.token;
      api.token = config.token;
    }
  }
}

async function* handleStreamMessages(result: {
  messages: Array<ChatMessage>;
  done: boolean;
  deferred: Deferred | null;
  error: Error | null;
}): AsyncGenerator<StreamChatData> {
  while (true) {
    if (result.done) {
      break;
    }
    if (!result.messages.length) {
      await result.deferred?.promise;
      if (result.error) {
        throw result.error;
      }
    }
    let message = result.messages.shift();
    while (message) {
      try {
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
      } catch (e) {
        console.error('Failed to parse json data from event-stream', e);
      }
      message = result.messages.shift();
    }
  }
}
