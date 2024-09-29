import { fetch, FormData, type RequestInit, type Response } from './shims/index.js';
import { v4 as uuidv4 } from 'uuid';
import { getLines, getMessages, type EventSourceMessage } from './parse.js';
import { formatAddtionalMessages } from './utils.js';
import { type Config } from './v1.js';
import {
  type ChatV2Req,
  type ChatV2Resp,
  type ChatV2StreamResp,
  type BotInfo,
  type SimpleBot,
  type EnterMessage,
  type MetaDataType,
  type Conversation,
  type RoleType,
  type ObjectStringItem,
  type ContentType,
  type OAuthTokenData,
  type DeviceCodeData,
  type DeviceTokenData,
  type JWTTokenData,
  type JWTScope,
} from './v2.js';
import { type ChatV3Message, type ChatV3Req, type ChatV3Resp, type ChatV3StreamResp, type FileObject } from './v3.js';
import Stream from './stream.js';

type ConversationResponse = { data: ChatV3Message[]; first_id: string; last_id: string; has_more: boolean };

export class Coze {
  private readonly config: Config;
  private readonly fetch: typeof fetch;

  constructor(config: Config) {
    this.config = {
      token: config.token,
      endpoint: config?.endpoint ?? 'https://api.coze.com',
    };

    this.fetch = fetch;
  }

  public async chatV2(request: Omit<ChatV2Req, 'stream'>): Promise<ChatV2Resp> {
    const { bot_id, query, chat_history, custom_variables } = request;
    const user = request.user ?? uuidv4();
    const conversation_id = request.conversation_id ?? uuidv4();

    const payload = {
      bot_id,
      user,
      query,
      chat_history,
      custom_variables,
      stream: false,
    };
    const apiUrl = `/open_api/v2/chat?conversation_id=${conversation_id}`;
    const response = await this.makeRequest<ChatV2Resp>(apiUrl, 'POST', payload);
    return response;
  }

  public async chatV2Streaming(request: Omit<ChatV2Req, 'stream'>): Promise<AsyncGenerator<ChatV2StreamResp>> {
    const { bot_id, query, chat_history, custom_variables } = request;
    const user = request.user ?? uuidv4();
    const conversation_id = request.conversation_id ?? uuidv4();

    const payload = {
      bot_id,
      user,
      query,
      chat_history,
      custom_variables,
      stream: true,
    };
    const apiUrl = `/open_api/v2/chat?conversation_id=${conversation_id}`;
    const response = await this.makeRequest(apiUrl, 'POST', payload, true);

    return this.handleStreamingResponse<ChatV2StreamResp>(response);
  }

  public async chatV3(request: Omit<ChatV3Req, 'stream'>): Promise<ChatV3Resp> {
    const user_id = request.user_id ?? uuidv4();
    const additional_messages = formatAddtionalMessages(request.additional_messages ?? []);
    const auto_save_history = request.auto_save_history ?? true;
    const { bot_id, custom_variables, meta_data, conversation_id, tools } = request;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload: ChatV3Req = {
      bot_id,
      user_id,
      custom_variables,
      auto_save_history,
      meta_data,
      tools,
      stream: false,
    };
    if (additional_messages.length) {
      payload.additional_messages = additional_messages;
    }

    const response = await this.makeRequest<{ data: ChatV3Resp }>(apiUrl, 'POST', payload);

    return response.data;
  }

  public async chatV3Streaming(request: Omit<ChatV3Req, 'stream'>): Promise<AsyncGenerator<ChatV3StreamResp>> {
    const { conversation_id, ...rest } = request;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload: ChatV3Req = {
      ...rest,
      stream: true,
    };

    const response = await this.makeRequest(apiUrl, 'POST', payload, true);

    return this.handleStreamingResponse(response);
  }

  public async chatV3Streaming2(request: Omit<ChatV3Req, 'stream'>): Promise<Stream<ChatV3StreamResp>> {
    const { conversation_id, ...rest } = request;
    const apiUrl = `/v3/chat${conversation_id ? `?conversation_id=${conversation_id}` : ''}`;
    const payload: ChatV3Req = {
      ...rest,
      stream: true,
    };

    const response = await this.makeRequest(apiUrl, 'POST', payload, true);

    return new Stream<ChatV3StreamResp>(response.body as ReadableStream, (event, data) => {
      if (event === 'done') {
        return { event, data } as ChatV3StreamResp;
      } else if (event === 'error') {
        throw new Error(data as string);
      }
      return { event, data: JSON.parse(data) } as ChatV3StreamResp;
    });
  }

  public async getBotInfo({ bot_id }: { bot_id: string }): Promise<BotInfo> {
    const apiUrl = `/v1/bot/get_online_info?bot_id=${bot_id}`;
    const response = await this.makeRequest<{ data: BotInfo }>(apiUrl, 'GET');
    return response.data;
  }

  public async listBots({ space_id, page_size = 20, page_index = 1 }: { space_id: string; page_size?: number; page_index?: number }): Promise<{
    space_bots: SimpleBot[];
    page_size: number;
    page_index: number;
    total: number;
  }> {
    const apiUrl = `/v1/space/published_bots_list?space_id=${space_id}&page_size=${page_size}&page_index=${page_index}`;
    const response = await this.makeRequest<{
      data: { total: number; space_bots: SimpleBot[] };
    }>(apiUrl, 'GET');
    return { page_size, page_index, ...response.data };
  }

  public async createConversation({
    messages,
    meta_data,
  }: {
    messages?: EnterMessage[];
    meta_data?: MetaDataType;
  } = {}): Promise<Conversation> {
    const apiUrl = `/v1/conversation/create`;
    const payload = this.formatConversationPayload(messages, meta_data);
    const response = await this.makeRequest<{ data: Conversation }>(apiUrl, 'POST', payload);
    return response.data;
  }

  public async getConversation({ conversation_id }: { conversation_id: string }): Promise<Conversation> {
    const apiUrl = `/v1/conversation/retrieve?conversation_id=${conversation_id}`;
    const response = await this.makeRequest<{ data: Conversation }>(apiUrl, 'GET');
    return response.data;
  }

  public async createMessage({
    conversation_id,
    role,
    content,
    content_type,
    meta_data,
  }: {
    conversation_id: string;
    role: RoleType;
    content: string | ObjectStringItem[];
    content_type: ContentType;
    meta_data: MetaDataType;
  }): Promise<ChatV3Message> {
    const apiUrl = `/v1/conversation/message/create?conversation_id=${conversation_id}`;
    const payload = this.formatMessagePayload({
      role,
      content,
      content_type,
      meta_data,
    });
    const response = await this.makeRequest<{ data: ChatV3Message }>(apiUrl, 'POST', payload);
    return this.parseMessageContent(response.data);
  }

  public async listMessages({
    conversation_id,
    order = 'desc',
    chat_id,
    before_id,
    after_id,
    limit = 50,
  }: {
    conversation_id: string;
    order?: 'desc' | 'asc';
    chat_id?: string;
    before_id?: string;
    after_id?: string;
    limit?: number;
  }): Promise<{
    data: ChatV3Message[];
    pagination: {
      first_id: string;
      last_id: string;
      has_more: boolean;
    };
  }> {
    const apiUrl = `/v1/conversation/message/list?conversation_id=${conversation_id}`;
    const payload = { order, chat_id, before_id, after_id, limit };
    const response = await this.makeRequest<ConversationResponse>(apiUrl, 'POST', payload);
    return this.parseMessageListResponse(response);
  }

  public async readMessage({ message_id, conversation_id }: { conversation_id: string; message_id: string }): Promise<ChatV3Message> {
    const apiUrl = `/v1/conversation/message/retrieve?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this.makeRequest<{ data: ChatV3Message }>(apiUrl, 'GET');
    return this.parseMessageContent(response.data);
  }

  public async updateMessage({
    message_id,
    conversation_id,
    meta_data,
    content,
    content_type,
  }: {
    conversation_id: string;
    message_id: string;
    meta_data?: MetaDataType;
    content?: string | ObjectStringItem[];
    content_type?: ContentType;
  }): Promise<ChatV3Message> {
    const apiUrl = `/v1/conversation/message/modify?conversation_id=${conversation_id}&message_id=${message_id}`;
    const payload = this.formatMessagePayload({
      meta_data,
      content,
      content_type,
    });
    const response = await this.makeRequest<{ message: ChatV3Message }>(apiUrl, 'POST', payload);
    return this.parseMessageContent(response.message);
  }

  public async getChat({ conversation_id, chat_id }: { conversation_id: string; chat_id: string }): Promise<ChatV3Resp> {
    const apiUrl = `/v3/chat/retrieve?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const response = await this.makeRequest<{ data: ChatV3Resp }>(apiUrl, 'GET');
    return response.data;
  }

  public async getChatHistory({ conversation_id, chat_id }: { conversation_id: string; chat_id: string }): Promise<ChatV3Message[]> {
    const apiUrl = `/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const response = await this.makeRequest<{ data: ChatV3Message[] }>(apiUrl, 'POST');
    return response.data || [];
  }

  /**
   * https://www.coze.cn/docs/developer_guides/upload_files
   * @param filePath The file will be uploaded.
   * @returns
   */
  public async uploadFile({ file }: { file: unknown }): Promise<FileObject> {
    // const fileBuffer = await readFile(filePath);
    // const file = new File([fileBuffer], basename(filePath));
    const body = new FormData();
    body.set('file', file as Blob, 'filepath');

    const apiUrl = `/v1/files/upload`;
    const response = await this.makeRequest<{ data: FileObject }>(apiUrl, 'POST', body);
    return response.data;
  }

  /**
   * https://www.coze.cn/docs/developer_guides/retrieve_files
   * @param file_id The file id.
   * @returns
   */
  public async readFileMeta({ file_id }: { file_id: string }): Promise<FileObject> {
    const apiUrl = `/v1/files/retrieve?file_id=${file_id}`;
    const response = await this.makeRequest<{ data: FileObject }>(apiUrl, 'GET');
    return response.data;
  }

  public async runWorkflow({
    workflow_id,
    parameters,
    bot_id,
    ext,
  }: {
    workflow_id: string;
    bot_id?: string;
    parameters?: Record<string, unknown>;
    ext?: Record<string, string>;
  }): Promise<{
    cost: string;
    token: number;
    data: unknown;
  }> {
    const apiUrl = `/v1/workflow/run`;
    const payload = { workflow_id, parameters, bot_id, ext };
    const response = await this.makeRequest<{
      data: string;
      cost: string;
      token: number;
    }>(apiUrl, 'POST', payload);
    return {
      cost: response.cost,
      token: response.token,
      data: JSON.parse(response.data),
    };
  }

  public async getOAuthToken({
    grant_type,
    client_id,
    redirect_uri,
    code,
    code_verifier,
  }: {
    grant_type: string;
    client_id: string;
    redirect_uri: string;
    code: string;
    code_verifier?: string;
  }): Promise<OAuthTokenData> {
    const apiUrl = `/api/permission/oauth2/token`;

    const payload = {
      grant_type,
      client_id,
      redirect_uri,
      code,
      code_verifier,
    };

    return await this.makeRequest<OAuthTokenData>(apiUrl, 'POST', payload);
  }

  public async getDeviceCode({ client_id }: { client_id: string }): Promise<DeviceCodeData> {
    const apiUrl = `/api/permission/oauth2/device/code`;

    const payload = {
      client_id,
    };
    return await this.makeRequest<DeviceCodeData>(apiUrl, 'POST', payload);
  }

  public async getDeviceToken({
    grant_type,
    client_id,
    device_code,
  }: {
    grant_type: string;
    client_id: string;
    device_code: string;
  }): Promise<DeviceTokenData> {
    const apiUrl = `/api/permission/oauth2/token`;

    const payload = {
      grant_type,
      client_id,
      device_code,
    };

    return await this.makeRequest<DeviceTokenData>(apiUrl, 'POST', payload);
  }

  public async getJWTToken({
    grant_type,
    duration_seconds,
    scope,
  }: {
    grant_type: string;
    duration_seconds?: number;
    scope?: JWTScope;
  }): Promise<JWTTokenData> {
    const apiUrl = `/api/permission/oauth2/token`;

    const payload = {
      grant_type,
      duration_seconds,
      scope,
    };

    return await this.makeRequest<JWTTokenData>(apiUrl, 'POST', payload);
  }

  private async makeRequest(apiUrl: string, method: 'GET' | 'POST', body?: unknown, isStream?: true): Promise<Response>;
  private async makeRequest<T = unknown>(apiUrl: string, method: 'GET' | 'POST', body?: unknown, isStream?: false): Promise<T>;
  private async makeRequest<T = unknown>(apiUrl: string, method: 'GET' | 'POST', body?: unknown, isStream: boolean = false): Promise<T | Response> {
    const fullUrl = `${this.config.endpoint}${apiUrl}`;
    const headers = {
      authorization: `Bearer ${this.config.token}`,
      // 'agw-js-conv': 'str',  FIXME: browser 下存在跨域问题，后续再看看
    };
    const options: RequestInit = { method, headers };
    if (body instanceof FormData) {
      // XXX: content-type: multipart/form-data; boundary=----formdata-undici-067154417494
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options.body = body as any;
    } else if (body) {
      headers['content-type'] = 'application/json';
      options.body = JSON.stringify(body);
    }

    const response = await this.fetch(fullUrl, options);
    const contentType = response.headers.get('content-type');

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    if (isStream) {
      if (contentType && contentType.includes('application/json')) {
        // 可能是出错了，因为 streaming 模式下，content-type 需要是 text/event-stream
        // 有时候 API 返回的是
        //   status_code: 200
        //   content_type: application/json; charset=utf-8
        //   body: {"code":4000,"msg":"Request parameter error"}
        // 这种奇葩设计

        const { code, msg } = (await response.json()) as { code: number; msg: string };
        if (code !== 0) {
          const logId = response.headers.get('x-tt-logid');
          throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
        }
      }
      return response;
    }

    if (contentType && contentType.includes('application/json')) {
      const { code, msg, ...payload } = (await response.json()) as { code: number; msg: string } & Record<string, unknown>;
      if (code !== 0 && code !== undefined) {
        const logId = response.headers.get('x-tt-logid');
        throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
      }

      // data: {....}
      // message: {....}
      // data: [....], first_id: "....", last_id: "....", has_more: true
      // ...
      return payload as T;
    } else {
      return (await response.text()) as T;
    }
  }

  private async *handleStreamingResponse<T>(response: Response): AsyncGenerator<T, void, unknown> {
    let latestMessage: { event: string | undefined; data: unknown } | null = null;

    const parseMessageData = (msg: EventSourceMessage): { event: string | undefined; data: unknown } => {
      // 兼容一下 v2 和 v3 的格式
      //
      // v2: https://www.coze.cn/docs/developer_guides/chat
      // data: { event: "message", message: { ... }, is_finish: false, index: 0, conversation_id: "xxx", seq_id: 123 }
      // data: { event: "done" }
      //
      // v3: https://www.coze.cn/docs/developer_guides/chat_v3
      // event: conversation.chat.created
      // data: {...}
      // event: conversation.message.delta
      // data: {...}
      // event: done
      // data: [DONE]
      let { data, event } = msg;
      if (event) {
        data = event === 'done' ? '[DONE]' : JSON.parse(data);
      } else {
        const parsedData = JSON.parse(data);
        event = parsedData.event;
        data = event === 'done' ? '[DONE]' : parsedData;
        if (event !== 'done') {
          delete parsedData.event;
        }
      }
      return { event, data };
    };

    const onMessage = (msg: EventSourceMessage) => {
      latestMessage = parseMessageData(msg);
    };

    const noop = () => {};
    const onLine = getMessages(noop, noop, onMessage);
    const onChunk = getLines(onLine);
    // FIXME any
    // const body: ReadableStream<Uint8Array> = response.body!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = response.body!;
    for await (const chunk of body) {
      onChunk(chunk);
      if (latestMessage) {
        yield latestMessage;
        latestMessage = null;
      }
    }
  }

  private formatConversationPayload(messages?: EnterMessage[], meta_data?: MetaDataType): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    if (messages) {
      payload.messages = messages.map(v => ({
        ...v,
        content: v.content_type === 'object_string' && Array.isArray(v.content) ? JSON.stringify(v.content) : v.content,
      }));
    }
    if (meta_data) {
      payload.meta_data = meta_data;
    }
    return payload;
  }

  private formatMessagePayload({
    role,
    content,
    content_type,
    meta_data,
  }: {
    role?: RoleType;
    content?: string | ObjectStringItem[];
    content_type?: ContentType;
    meta_data?: MetaDataType;
  }): Record<string, unknown> {
    const payload = { role, content, content_type, meta_data };
    if (content_type === 'object_string' && Array.isArray(content)) {
      payload.content = JSON.stringify(content);
    }
    return payload;
  }

  private parseMessageContent(message: ChatV3Message): ChatV3Message {
    if (message.content_type === 'object_string' && typeof message.content === 'string') {
      message.content = JSON.parse(message.content);
    }
    return message;
  }

  private parseMessageListResponse(response: ConversationResponse): {
    data: ChatV3Message[];
    pagination: {
      first_id: string;
      last_id: string;
      has_more: boolean;
    };
  } {
    const { data, first_id, last_id, has_more } = response;
    if (Array.isArray(data)) {
      data.forEach((item: ChatV3Message) => {
        if (item.content_type === 'object_string' && typeof item.content === 'string') {
          item.content = JSON.parse(item.content);
        }
      });
    }
    return {
      data,
      pagination: { first_id, last_id, has_more },
    };
  }
}
