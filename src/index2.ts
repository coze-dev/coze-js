import "whatwg-fetch";
import { v4 as uuidv4 } from "uuid";
import { formatAddtionalMessages } from "./utils.js";
import {
  getBytes,
  getLines,
  getMessages,
  EventSourceMessage,
} from "./parse.js";
import { Fetch, Config } from "./v1.js";
import {
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
} from "./v3.js";

export class Coze {
  private readonly config: Config;
  private readonly fetch: Fetch;

  constructor(config: Partial<Config>) {
    this.config = {
      api_key: config?.api_key!,
      endpoint: config?.endpoint ?? "https://api.coze.com",
    };

    this.fetch = config?.fetch ?? fetch;
  }

  public async chatV2(request: Omit<ChatV2Req, "stream">): Promise<ChatV2Resp> {
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
    const response = await this.makeRequest(apiUrl, "POST", payload);

    return response as ChatV2Resp;
  }

  public async chatV2Streaming(
    request: Omit<ChatV2Req, "stream">
  ): Promise<
    AsyncGenerator<
      | { event: "message"; data: ChatV2StreamResp }
      | { event: "done"; data: "DONE" }
    >
  > {
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
    const response = await this.makeRequest(apiUrl, "POST", payload, true);

    return this.handleStreamingResponse(response);
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
    const apiUrl = `/v3/chat${
      conversation_id ? `?conversation_id=${conversation_id}` : ""
    }`;
    const payload: ChatV3Req = {
      bot_id,
      user_id,
      custom_variables,
      auto_save_history,
      meta_data,
      additional_messages: formatAddtionalMessages(request.additional_messages),
      stream: false,
    };

    const response = await this.makeRequest(apiUrl, "POST", payload);

    return response as ChatV3Resp;
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
    const apiUrl = `/v3/chat${
      conversation_id ? `?conversation_id=${conversation_id}` : ""
    }`;
    const payload: ChatV3Req = {
      bot_id,
      user_id,
      custom_variables,
      auto_save_history,
      meta_data,
      additional_messages: formatAddtionalMessages(request.additional_messages),
      stream: true,
    };

    const response = await this.makeRequest(apiUrl, "POST", payload, true);

    return this.handleStreamingResponse(response);
  }

  public async getBotInfo({ bot_id }: { bot_id: string }): Promise<BotInfo> {
    const apiUrl = `/v1/bot/get_online_info?bot_id=${bot_id}`;
    const response = await this.makeRequest(apiUrl, "GET");
    return response as BotInfo;
  }

  public async listBots({
    space_id,
    page_size = 20,
    page_index = 1,
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
    const apiUrl = `/v1/space/published_bots_list?space_id=${space_id}&page_size=${page_size}&page_index=${page_index}`;
    const response = await this.makeRequest(apiUrl, "GET");
    return { page_size, page_index, ...response };
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
    const response = await this.makeRequest(apiUrl, "POST", payload);
    return response as Conversation;
  }

  public async getConversation({
    conversation_id,
  }: {
    conversation_id: string;
  }): Promise<Conversation> {
    const apiUrl = `/v1/conversation/retrieve?conversation_id=${conversation_id}`;
    const response = await this.makeRequest(apiUrl, "GET");
    return response as Conversation;
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
    const response = await this.makeRequest(apiUrl, "POST", payload);
    return this.parseMessageContent(response);
  }

  public async listMessages({
    conversation_id,
    order = "desc",
    chat_id,
    before_id,
    after_id,
    limit = 50,
  }: {
    conversation_id: string;
    order?: "desc" | "asc";
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
    const response = await this.makeRequest(apiUrl, "POST", payload);
    return this.parseMessageListResponse(response);
  }

  public async readMessage({
    message_id,
    conversation_id,
  }: {
    conversation_id: string;
    message_id: string;
  }): Promise<ChatV3Message> {
    const apiUrl = `/v1/conversation/message/retrieve?conversation_id=${conversation_id}&message_id=${message_id}`;
    const response = await this.makeRequest(apiUrl, "GET");
    return this.parseMessageContent(response);
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
    const response = await this.makeRequest(apiUrl, "POST", payload);
    return this.parseMessageContent(response.message);
  }

  public async getChat({
    conversation_id,
    chat_id,
  }: {
    conversation_id: string;
    chat_id: string;
  }): Promise<ChatV3Resp> {
    const apiUrl = `/v3/chat/retrieve?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const response = await this.makeRequest(apiUrl, "GET");
    return response as ChatV3Resp;
  }

  public async getChatHistory({
    conversation_id,
    chat_id,
  }: {
    conversation_id: string;
    chat_id: string;
  }): Promise<ChatV3Message[]> {
    const apiUrl = `/v3/chat/message/list?conversation_id=${conversation_id}&chat_id=${chat_id}`;
    const response = await this.makeRequest(apiUrl, "POST", {});
    return response || [];
  }

  private async makeRequest(
    apiUrl: string,
    method: "GET" | "POST",
    body?: any,
    isStream: boolean = false
  ): Promise<any> {
    const fullUrl = `${this.config.endpoint}${apiUrl}`;
    const headers = {
      authorization: `Bearer ${this.config.api_key}`,
      "content-type": "application/json",
    };
    const options: RequestInit = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await this.fetch(fullUrl, options);

    if (isStream) {
      return response;
    }

    const { data, code, msg } = await response.json();
    if (code !== 0) {
      const logId = response.headers.get("x-tt-logid");
      throw new Error(`code: ${code}, msg: ${msg}, logid: ${logId}`);
    }
    return data;
  }

  private async handleStreamingResponse(
    response: Response
  ): Promise<AsyncGenerator<any>> {
    const messageQueue: any[] = [];
    let resolveMessage: (() => void) | null = null;

    const onMessage = (msg: EventSourceMessage) => {
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
        // v3 格式
        if (event === "done") {
          data = "[DONE]";
        } else {
          data = JSON.parse(data);
        }
      } else {
        // v2 格式
        const parsedData = JSON.parse(data);
        event = parsedData.event;
        if (event === "done") {
          data = "[DONE]";
        } else {
          delete parsedData.event;
          data = parsedData;
        }
      }
      messageQueue.push({ event, data });

      if (resolveMessage) {
        resolveMessage();
        resolveMessage = null;
      }
    };

    getBytes(
      response.body!,
      getLines(
        getMessages(
          () => {},
          () => {},
          onMessage
        )
      )
    );

    return (async function* () {
      while (true) {
        if (messageQueue.length > 0) {
          yield* messageQueue;
          messageQueue.length = 0;
        } else {
          await new Promise<void>((resolve) => {
            resolveMessage = resolve;
          });
        }
      }
    })();
  }

  private formatConversationPayload(
    messages?: EnterMessage[],
    meta_data?: MetaDataType
  ): any {
    const payload: any = {};
    if (messages) {
      payload.messages = messages.map((v) => ({
        ...v,
        content:
          v.content_type === "object_string" && Array.isArray(v.content)
            ? JSON.stringify(v.content)
            : v.content,
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
  }): any {
    const payload: any = { role, content, content_type, meta_data };
    if (content_type === "object_string" && Array.isArray(content)) {
      payload.content = JSON.stringify(content);
    }
    return payload;
  }

  private parseMessageContent(message: any): ChatV3Message {
    if (
      message.content_type === "object_string" &&
      typeof message.content === "string"
    ) {
      message.content = JSON.parse(message.content);
    }
    return message;
  }

  private parseMessageListResponse(response: any): {
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
        if (
          item.content_type === "object_string" &&
          typeof item.content === "string"
        ) {
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
