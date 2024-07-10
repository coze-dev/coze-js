import "whatwg-fetch";
import { v4 as uuidv4 } from "uuid";
import { post } from "./utils.js";
import {
  getBytes,
  getLines,
  getMessages,
  type EventSourceMessage,
} from "./parse.js";
import type {
  Fetch,
  Config,
  ChatV1Req,
  ChatV1Resp,
  ChatV1StreamResp,
} from "./interfaces.js";

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
    request: ChatV1Req
  ): Promise<ChatV1Resp | AsyncGenerator<ChatV1StreamResp>> {
    if (!this.config.api_key) {
      throw new Error('Missing "api_key" in config');
    }

    const body = { ...request };
    body.stream = body.stream ?? false;
    body.conversation_id = body.conversation_id ?? uuidv4();
    body.user = body.user ?? uuidv4();

    const headers = {
      authorization: "Bearer " + this.config.api_key,
      "content-type": "application/json",
    };

    const apiUrl = `${this.config.endpoint}${apiName}`;
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
            const msg: EventSourceMessage = messageQueue.shift()!;
            // {event: 'done'}
            // {event: 'message', message: '...' }
            const streamResp = JSON.parse(msg.data);
            yield streamResp as any;
          } else {
            await new Promise<void>((resolve) => {
              resolveMessage = resolve;
            });
          }
        }
      })();
    } else {
      return (await response.json()) as ChatV1Resp;
    }
  }

  chat(
    request: ChatV1Req & { stream: true }
  ): Promise<AsyncGenerator<ChatV1StreamResp>>;
  chat(request: ChatV1Req & { stream?: false }): Promise<ChatV1Resp>;

  async chat(
    request: ChatV1Req
  ): Promise<ChatV1Resp | AsyncGenerator<ChatV1StreamResp>> {
    return this.processStreamableRequest("/v2/chat", request);
  }
}
