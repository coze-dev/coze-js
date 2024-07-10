import "whatwg-fetch";
import { v4 as uuidv4 } from "uuid";
import { post } from "./utils.js";
import {
  getBytes,
  getLines,
  getMessages,
  type EventSourceMessage,
} from "./parse.js";
import type { Fetch, Config } from "./v1.js";
import type { ChatV2Req, ChatV2Resp, ChatV2StreamResp } from "./v2.js";

export class Coze {
  private readonly config: Config;
  private readonly fetch: Fetch;

  constructor(config: Partial<Config>) {
    this.config = {
      api_key: config?.api_key!,
      endpoint: config?.endpoint ?? "https://api.coze.com/open_api",
    };

    this.fetch = fetch;
    if (config?.fetch != null) {
      this.fetch = config.fetch;
    }
  }

  private async processStreamableRequest(
    apiName: string,
    request: ChatV2Req
  ): Promise<ChatV2Resp | AsyncGenerator<ChatV2StreamResp>> {
    if (!this.config.api_key) {
      throw new Error('Missing "api_key" in config');
    }

    const body = { ...request };
    body.stream = body.stream ?? false;
    body.user = body.user ?? uuidv4();

    const conversation_id = request.conversation_id ?? uuidv4();

    const headers = {
      authorization: "Bearer " + this.config.api_key,
      "content-type": "application/json",
    };

    const apiUrl = `${this.config.endpoint}${apiName}?conversation_id=${conversation_id}`;
    const response = await post(this.fetch, apiUrl, body, headers);
    if (!response.body) {
      throw new Error("Missing body");
    }

    if (body.stream) {
      const onId = () => {};
      const onRetry = () => {};
      let messageQueue: EventSourceMessage[] = [];
      let resolveMessage: (() => void) | null = null;

      const onMessage = (msg: EventSourceMessage) => {
        messageQueue.push(msg);
        if (resolveMessage) {
          resolveMessage();
          resolveMessage = null;
        }
      };

      getBytes(response.body, getLines(getMessages(onId, onRetry, onMessage)));

      return (async function* () {
        while (true) {
          if (messageQueue.length > 0) {
            for (let i = 0; i < messageQueue.length; i++) {
              const msg: EventSourceMessage = messageQueue[i];
              // {event: 'done'}
              // {event: 'message', message: '...' }
              const streamResp = JSON.parse(msg.data);
              yield streamResp as any;
            }
            messageQueue = [];
          } else {
            await new Promise<void>((resolve) => {
              resolveMessage = resolve;
            });
          }
        }
      })();
    } else {
      return (await response.json()) as ChatV2Resp;
    }
  }

  chat(
    request: ChatV2Req & { stream: true }
  ): Promise<AsyncGenerator<ChatV2StreamResp>>;
  chat(request: ChatV2Req & { stream?: false }): Promise<ChatV2Resp>;

  async chat(
    request: ChatV2Req
  ): Promise<ChatV2Resp | AsyncGenerator<ChatV2StreamResp>> {
    return this.processStreamableRequest("/v2/chat", request);
  }
}
