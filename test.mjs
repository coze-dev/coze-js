import { Coze } from "@coze/coze-js";

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const query = "北京新闻";

const stream = true;
const coze = new Coze({ api_key: apiKey });

const c = await coze.createConversation({
  messages: [
    {
      role: 'assistant',
      content_type: 'text',
      content: "Hi, you are an assistant"
    },
    {
      role: 'user',
      content_type: 'object_string',
      content: [
        { type: 'text', text: '123' },
        { type: 'image', file_url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png' }/*, { type: 'file', file_id: '{{file_id_1}}' }*/
      ]
    },
  ],
  meta_data: {
    a: 'b',
    c: 'd',
    k: 'z',
  }
});
console.log(c);
const c2 = await coze.getConversation({ conversation_id: c.id });
console.log(c2);
const m = await coze.createMessage({
  conversation_id: c2.id,
  content_type: 'object_string',
  role: 'user',
  content: [
    { type: 'text', text: '是的方式的是否' },
    { type: 'image', file_url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png' }
  ],
  meta_data: {
    '想想': '111',
    '🚗': 'eee'
  }
});
console.log(m);
const m2 = await coze.listMessages({ conversation_id: c2.id });
console.log('%j', m2);
const m3 = await coze.readMessage({ conversation_id: c2.id, message_id: m.id });
console.log(m3);
const m4 = await coze.updateMessage({
  conversation_id: c2.id, message_id: m3.id,
  content: '121212121',
  content_type: 'text',
  meta_data: {
    'x': '1',
    'b': '2'
  }
});
console.log(m4);

const a = await coze.listBots({ space_id: '7309440314236747794' });
console.log(a);

const b = await coze.getBotInfo({ bot_id: botId });
console.log(b);

const v = await coze.chatV2Streaming({ query, bot_id: botId });

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

