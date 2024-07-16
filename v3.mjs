import { clearLine, cursorTo } from 'node:readline'
import { Coze } from "./dist/index.js";

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const query = "北京新闻";


async function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  })
}

async function streamingWorkflow() {
  console.log('=== Streaming Chat ===');

  const coze = new Coze({ api_key: apiKey/*, endpoint: 'http://localhost:1299'*/ });
  const v = await coze.chatV3Streaming({
    bot_id: botId,
    auto_save_history: false,

    // 这里的 additional_messages 必须要有，不然会报错，实际上也不会用到
    additional_messages: [
      {
        role: 'user',
        content: '123',
        content_type: 'text'
      }
    ],

    tools: [
      {
        plugin_id: '7392068826772520978',
        parameters: JSON.stringify({ query }),
        api_name: "news_search"
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

  console.log('=== End of Streaming Chat ===');
}

async function streamingChat() {
  console.log('=== Streaming Chat ===');

  const coze = new Coze({ api_key: apiKey });
  const v = await coze.chatV3Streaming({
    bot_id: botId,
    auto_save_history: false,
    additional_messages: [
      {
        role: 'user',
        content: query,
        content_type: 'text'
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

  console.log('=== End of Streaming Chat ===');
}

async function nonStreamingChat() {
  console.log('=== Non-Streaming Chat ===');

  const coze = new Coze({ api_key: apiKey });
  const v = await coze.chatV3({
    bot_id: botId,
    additional_messages: [
      {
        role: 'user',
        content: query,
        content_type: 'text'
      }
    ]
  });

  const chat_id = v.id;
  const conversation_id = v.conversation_id;
  while (true) {
    await sleep(100);
    const chat = await coze.getChat({ chat_id, conversation_id });
    if (chat.status === 'completed'
      || chat.status === 'failed'
      || chat.status === 'requires_action'
    ) {
      console.log(chat.usage);
      break;
    }
    const messageList = await coze.getChatHistory({ chat_id, conversation_id });
    if (messageList.length <= 0) {
      process.stdout.write('.');
    } else {
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
      process.stdout.write('');
      for (const item of messageList) {
        // console.log(item);
        console.log("[%s]:[%s]:%s", item.role, item.type, item.content);
      }
    }
  }
}

async function main() {
  // await streamingWorkflow();
  await streamingChat();
  await nonStreamingChat();
}

main().catch(console.error);