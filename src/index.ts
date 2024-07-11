import "whatwg-fetch";
import { v4 as uuidv4 } from "uuid";
import { formatAddtionalMessages } from "./utils.js";
import {
  getBytes,
  getLines,
  getMessages,
  type EventSourceMessage,
} from "./parse.js";
import type { Fetch, Config } from "./v1.js";
import type {
  ChatV2Req,
  ChatV2Resp,
  ChatV2StreamResp,
  BotInfo,
  SimpleBot,
  EnterMessage,
  MetaDataType,
  Conversation,
  RoleType,
  ObjectStringItem,
  ContentType,
} from "./v2.js";
import {
  ChatV3Message,
  ChatV3Req,
  ChatV3Resp,
  ChatV3StreamResp,
  ChatV3StreamingEventType,
} from "./v3.js";

export class Coze {
  private readonly config: Config;
  private readonly fetch: Fetch;

  constructor(config: Partial<Config>) {
    this.config = {
      api_key: config?.api_key!,
      endpoint: config?.endpoint ?? "https://api.coze.com",
    };

    this.fetch = fetch;
    if (config?.fetch != null) {
      this.fetch = config.fetch;
    }
  }

  // chat(
  //   request: ChatV2Req & { stream: true }
  // ): Promise<AsyncGenerator<ChatV2StreamResp>>;
  // chat(request: ChatV2Req & { stream?: false }): Promise<ChatV2Resp>;

  public async chatV2(
    request: Omit<ChatV2Req, "stream">
  ): Promise<ChatV2Resp | AsyncGenerator<ChatV2StreamResp>> {
    const { bot_id, query, chat_history, custom_variables } = request;
    let { user, conversation_id } = request;
    if (user == null) {
      user = uuidv4();
    }
    if (conversation_id == null) {
      conversation_id = uuidv4();
    }

    const payload = {
      bot_id,
      user,
      query,
      chat_history,
      custom_variables,
      stream: false,
    };
    const apiUrl = `/open_api/v2/chat?conversation_id=${conversation_id}`;
    const response = await this._POST(apiUrl, JSON.stringify(payload));

    const { messages, code, msg /*, conversation_id*/ } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return { messages, code, msg, conversation_id } as ChatV2Resp;
  }

  public async chatV2Streaming(
    request: Omit<ChatV2Req, "stream">
  ): Promise<AsyncGenerator<ChatV2StreamResp>> {
    const { bot_id, query, chat_history, custom_variables } = request;
    let { user, conversation_id } = request;
    if (user == null) {
      user = uuidv4();
    }
    if (conversation_id == null) {
      conversation_id = uuidv4();
    }

    const payload = {
      bot_id,
      user,
      query,
      chat_history,
      custom_variables,
      stream: true,
    };
    const apiUrl = `/open_api/v2/chat?conversation_id=${conversation_id}`;
    const response = await this._POST(apiUrl, JSON.stringify(payload));

    const onId = () => {};
    const onRetry = () => {};
    let messageQueue: any[] = [];
    let resolveMessage: (() => void) | null = null;

    const onMessage = (msg: EventSourceMessage) => {
      messageQueue.push(JSON.parse(msg.data));
      if (resolveMessage) {
        resolveMessage();
        resolveMessage = null;
      }
    };

    getBytes(response.body!, getLines(getMessages(onId, onRetry, onMessage)));

    return (async function* () {
      while (true) {
        if (messageQueue.length > 0) {
          for (let i = 0; i < messageQueue.length; i++) {
            // {event: 'done'}
            // {event: 'message', message: '...' }
            yield messageQueue[i] as any;
          }
          messageQueue = [];
        } else {
          await new Promise<void>((resolve) => {
            resolveMessage = resolve;
          });
        }
      }
    })();
  }

  public async chatV3(request: Omit<ChatV3Req, "stream">): Promise<ChatV3Resp> {
    const {
      bot_id,
      user_id,
      custom_variables,
      auto_save_history,
      meta_data,
      conversation_id,
    } = request;
    const apiUrl =
      "/v3/chat" +
      (conversation_id ? `?conversation_id=${conversation_id}` : "");
    const payload: ChatV3Req = {
      bot_id,
      user_id,
      custom_variables,
      auto_save_history,
      meta_data,
      additional_messages: formatAddtionalMessages(request.additional_messages),
      stream: false,
    };

    const response = await this._POST(apiUrl, JSON.stringify(payload));

    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return data as ChatV3Resp;
  }

  public async chatV3Streaming(
    request: Omit<ChatV3Req, "stream">
  ): Promise<AsyncGenerator<ChatV3StreamResp>> {
    const {
      bot_id,
      user_id,
      custom_variables,
      auto_save_history,
      meta_data,
      conversation_id,
    } = request;
    const apiUrl =
      "/v3/chat" +
      (conversation_id ? `?conversation_id=${conversation_id}` : "");
    const payload: ChatV3Req = {
      bot_id,
      user_id,
      custom_variables,
      auto_save_history,
      meta_data,
      additional_messages: formatAddtionalMessages(request.additional_messages),
      stream: true,
    };

    const response = await this._POST(apiUrl, JSON.stringify(payload));

    const onId = () => {};
    const onRetry = () => {};
    let messageQueue: any[] = [];
    let resolveMessage: (() => void) | null = null;

    const onMessage = (msg: EventSourceMessage) => {
      messageQueue.push({
        event: msg.event as ChatV3StreamingEventType,
        data: msg.event === "done" ? "[DONE]" : JSON.parse(msg.data),
      });
      if (resolveMessage) {
        resolveMessage();
        resolveMessage = null;
      }
    };

    getBytes(response.body!, getLines(getMessages(onId, onRetry, onMessage)));

    return (async function* () {
      while (true) {
        if (messageQueue.length > 0) {
          for (let i = 0; i < messageQueue.length; i++) {
            yield messageQueue[i] as any;
          }
          messageQueue = [];
        } else {
          await new Promise<void>((resolve) => {
            resolveMessage = resolve;
          });
        }
      }
    })();
  }

  /**
   * 获取指定 Bot 的配置信息。
   * @param bot_id 要查看的 Bot ID。
   */
  public async getBotInfo({ bot_id }: { bot_id: string }): Promise<BotInfo> {
    const apiUrl = `/v1/bot/get_online_info?bot_id=${bot_id}`;
    const response = await this._GET(apiUrl);
    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return data as BotInfo;
  }

  /**
   * 查看指定空间发布到 Bot as API 渠道的 Bot 列表。
   * @param space_id Bot 所在的空间的 Space ID。Space ID 是空间的唯一标识。
   * @param page_size 分页大小。默认为 20，即每页返回 20 条数据。
   * @param page_index 分页查询时的页码。默认为 1，即从第一页数据开始返回。
   */
  public async listBots({
    space_id,
    page_size,
    page_index,
  }: {
    space_id: string;
    page_size?: number;
    page_index?: number;
  }): Promise<{
    space_bots: SimpleBot[];
    page_size: number;
    page_index: number;
    total: number;
  }> {
    if (page_size == null) {
      page_size = 20;
    }
    if (page_index == null) {
      page_index = 1;
    }
    const apiUrl = `/v1/space/published_bots_list?space_id=${space_id}&page_size=${page_size}&page_index=${page_index}`;
    const response = await this._GET(apiUrl);
    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return { page_size, page_index, ...data };
  }

  /**
   * 创建一个会话。会话是 Bot 和用户之间的一段问答交互，一个会话包含一条或多条消息。
   */
  public async createConversation({
    messages,
    meta_data,
  }: {
    messages?: EnterMessage[];
    meta_data?: MetaDataType;
  } = {}): Promise<Conversation> {
    const apiUrl = `/v1/conversation/create`;
    const payload: any = {};
    if (messages != null) {
      // 处理一下 messages 里面 object_string 这个特殊的类型
      const _messages: EnterMessage[] = [];
      for (const v of messages) {
        if (v.content_type === "object_string" && Array.isArray(v.content)) {
          _messages.push({
            ...v,
            // 在 EnterMessage 里面允许 ObjectStringItem[] 是为了照顾好开发体验
            // 把 ObjectStringItem[] 转成 string 类型，交给大模型
            content: JSON.stringify(v.content),
          });
        } else {
          _messages.push(v);
        }
      }
      payload.messages = _messages;
    }
    if (meta_data != null) {
      payload.meta_data = meta_data;
    }
    const response = await this._POST(apiUrl, JSON.stringify(payload));
    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return data;
  }

  /**
   * 通过会话 ID 查看会话信息。
   * @param conversation_id Conversation ID，即会话的唯一标识。
   */
  public async getConversation({
    conversation_id,
  }: {
    conversation_id: string;
  }): Promise<Conversation> {
    const apiUrl = `/v1/conversation/retrieve?conversation_id=${conversation_id}`;
    const response = await this._GET(apiUrl);
    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return data;
  }

  /**
   * 创建一条消息，并将其添加到指定的会话中。
   */
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
    const payload = { role, content, content_type, meta_data };
    if (content_type === "object_string" && Array.isArray(content)) {
      payload.content = JSON.stringify(content);
    }
    const response = await this._POST(apiUrl, JSON.stringify(payload));
    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    if (content_type === "object_string" && typeof data.content === "string") {
      data.content = JSON.parse(data.content);
    }
    return data;
  }

  /**
   * 查看指定会话的消息列表。
   */
  public async listMessages({
    conversation_id,
    order,
    chat_id,
    before_id,
    after_id,
    limit,
  }: {
    /**
     * Conversation ID，即会话的唯一标识。
     */
    conversation_id: string;

    /**
     * 消息列表的排序方式。
     * - desc：（默认）按创建时间倒序
     * - asc：按创建时间正序
     */
    order?: "desc" | "asc";

    /**
     * 待查看的 Chat ID。
     */
    chat_id?: string;

    /**
     * 查看指定位置之前的消息。
     * 默认为 0，表示不指定位置。如需向前翻页，则指定为返回结果中的 first_id。
     */
    before_id?: string;

    /**
     * 查看指定位置之前的消息。
     * 默认为 0，表示不指定位置。如需向前翻页，则指定为返回结果中的 first_id。
     */
    after_id?: string;

    /**
     * 每次查询返回的数据量。默认为 50，取值范围为 1~50。
     */
    limit?: number;
  }): Promise<{
    /**
     * 消息详情。
     */
    data: ChatV3Message[];

    pagination: {
      /**
       * 返回的消息列表中，第一条消息的 Message ID。
       */
      first_id: string;

      /**
       * 返回的消息列表中，最后一条消息的 Message ID。
       */
      last_id: string;

      /**
       * 是否已返回全部消息。
       * - true：已返回全部消息。
       * - false：未返回全部消息，可再次调用此接口查看其他分页。
       */
      has_more: boolean;
    };
  }> {
    const apiUrl = `/v1/conversation/message/list?conversation_id=${conversation_id}`;
    const payload = { order, chat_id, before_id, after_id, limit };
    const response = await this._POST(apiUrl, JSON.stringify(payload));
    const { data, code, msg, first_id, last_id, has_more } =
      await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    if (Array.isArray(data)) {
      for (const item of data as ChatV3Message[]) {
        if (
          item.content_type === "object_string" &&
          typeof item.content === "string"
        ) {
          item.content = JSON.parse(item.content);
        }
      }
    }
    return { data, pagination: { first_id, last_id, has_more } };
  }

  /**
   * 查看指定消息的详细信息。
   */
  public async readMessage({
    message_id,
    conversation_id,
  }: {
    conversation_id: string;
    message_id: string;
  }): Promise<ChatV3Message> {
    const apiUrl = `/v1/conversation/message/retrieve?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this._GET(apiUrl);
    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    if (
      data.content_type === "object_string" &&
      typeof data.content === "string"
    ) {
      data.content = JSON.parse(data.content);
    }
    return data;
  }

  /**
   * 修改一条消息，支持修改消息内容、附加内容和消息类型。
   */
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
    const payload = { meta_data, content, content_type };
    if (content_type === "object_string" && Array.isArray(content)) {
      payload.content = JSON.stringify(content);
    }
    const response = await this._POST(apiUrl, JSON.stringify(payload));
    const { message: data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    if (
      data.content_type === "object_string" &&
      typeof data.content === "string"
    ) {
      data.content = JSON.parse(data.content);
    }
    return data;
  }

  /**
   * 查看对话的详细信息。
   */
  public async getChat({
    conversation_id,
    chat_id,
  }: {
    conversation_id: string;
    chat_id: string;
  }): Promise<ChatV3Resp> {
    const apiUrl = `/v3/chat/retrieve?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const response = await this._GET(apiUrl);
    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return data;
  }

  /**
   * 查看对话消息详情，查看指定对话中除 Query 以外的其他消息，包括模型回复、Bot 执行的中间结果等消息。
   */
  public async getChatHistory({
    conversation_id,
    chat_id,
  }: {
    conversation_id: string;
    chat_id: string;
  }): Promise<ChatV3Message[]> {
    const apiUrl = `/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const response = await this._POST(apiUrl, "{}");
    const raw = await response.json();
    // console.log(raw);
    const { data, code, msg } = raw;
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return data || [];
  }

  private async _GET(apiUrl: string): Promise<Response> {
    const fullUrl = `${this.config.endpoint}${apiUrl}`;
    const headers = {
      authorization: "Bearer " + this.config.api_key,
      "content-type": "application/json",
    };
    const response = await fetch(fullUrl, {
      method: "GET",
      headers,
    });
    return response;
  }

  private async _POST(apiUrl: string, body: any): Promise<Response> {
    const fullUrl = `${this.config.endpoint}${apiUrl}`;
    const headers = {
      authorization: "Bearer " + this.config.api_key,
      "content-type": "application/json",
    };
    const response = await fetch(fullUrl, {
      method: "POST",
      body,
      headers,
    });
    return response;
  }
}
