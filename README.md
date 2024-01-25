# Usage

## chat (stream mode)

```js
import { Coze } from "@coze/coze-js";

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const query = "北京新闻";

const coze = new Coze({ api_key: apiKey });
const v = await coze.chat({ query, bot_id: botId, stream: true });

for await (const part of v) {
  const message = part.message;
  if (!message) {
    console.error(part);
    continue;
  }

  if (
    message.role === "assistant" &&
    message.type === "answer" &&
    message.content_type === "text"
  ) {
    process.stdout.write(message.content);
    if (part.is_finish) {
      process.stdout.write("\n");
    }
  } else {
    console.log("[%s]:[%s]:%s", message.role, message.type, message.content);
  }
}
```

## chat (non-stream mode)

```js
import { Coze } from "@coze/coze-js";

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const query = "北京新闻";

const coze = new Coze({ api_key: apiKey });
const v = await coze.chat({ query, bot_id: botId, stream: false });

console.log(v);
```
