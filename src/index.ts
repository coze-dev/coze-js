import "whatwg-fetch";
import { v4 as uuidv4 } from "uuid";
import { post, parseJSON } from "./utils.js";
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
      endpoint: config?.endpoint ?? "https://bots.bytedance.net/open_api",
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
      const itr = parseJSON<ChatV1StreamResp>(response.body);
      return (async function* () {
        for await (const message of itr) {
          if ("error" in message) {
            throw new Error((message as any).error);
          }
          // message will be done in the case of chat and generate
          // message will be success in the case of a progress response (pull, push, create)
          if ((message as any).done) {
            return;
          }
          yield message;
        }
        throw new Error("Did not receive done or success response in stream.");
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
    return this.processStreamableRequest("/v1/chat", request);
  }
}
