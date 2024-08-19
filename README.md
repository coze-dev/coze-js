# Usage

## chat (stream mode)

```js
import { Coze } from "@coze/coze-js";

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const query = "北京新闻";

const coze = new Coze({ api_key: apiKey, endpoint });
const v = await coze.chatV3Streaming({
  additional_messages: [
    { role: 'user', content: query, content_type: 'text' },
  ],
  bot_id: botId,
});

for await (const part of v) {
  switch (part.event) {
    case 'conversation.message.delta':
    case 'conversation.message.completed': {
      const message = part.data;
      if (
        message.role === 'assistant' &&
        message.type === 'answer' &&
        message.content_type === 'text'
      ) {
        console.log(message.content);
      } else {
        console.log(
          '[%s]:[%s]:%s',
          message.role,
          message.type,
          message.content,
        );
      }
      break;
    }
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

const { id, conversation_id } = v;
while (true) {
  const res = await coze.getChatHistory({ conversation_id, chat_id: id });
  if (res.find(rec => rec.type === 'verbose' && isFinish(rec.content))) {
    res.forEach(message => {
      console.log('[%s]:[%s]:%s', message.role, message.type, message.content);
    });
    break;
  }
  // Polling for checking the results
  await wait(100);
}
```
