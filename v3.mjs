import { Coze } from "@coze/coze-js";

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const query = "北京新闻";

const stream = true;
const coze = new Coze({ api_key: apiKey });

const v = await coze.chatV3Streaming({
  user_id: 'user-123456',
  bot_id: botId,
  additional_messages: [
    {
      role: 'user',
      content: query,
      content_type: 'text',
      type: 'query'
    }
  ]
});

for await (const part of v) {
  if (part.event === 'conversation.chat.created') {
    console.log('[START]');
  }

  else if (part.event === 'conversation.message.delta') {
    process.stdout.write(part.data.content);
  }

  else if (part.event === 'conversation.message.completed') {
    const { role, type, content } = part.data;
    if (role === 'assistant' && type === 'answer') {
      process.stdout.write("\n");
    } else {
      console.log("[%s]:[%s]:%s", role, type, content);
    }
  }

  else if (part.event === 'conversation.chat.completed') {
    console.log(part.data.usage);
  }

  else if (part.event === 'done') {
    console.log(part.data);
  }
}
