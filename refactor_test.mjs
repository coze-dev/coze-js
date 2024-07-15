import fs from 'node:fs';
import { Coze } from "./dist/index.js";

const apiKey = process.env.COZE_API_KEY;
const botId = process.env.COZE_BOT_ID;
const query = "Please read the following code carefully, understand them and then refactor and optimize them for better maintainability.\n"
  + "Never change the code behavior, add necessary typings to the refactored code, reduce any type.\n\n"
  + "Keep the comments.\n\n"
  + "Only return the response don't give any explain.\n\n"
  + "```\n" + fs.readFileSync('src/index2.ts', 'utf-8') + "\n```"


async function streamingChatV2() {
  console.log('=== Streaming Chat V2 ===');

  const coze = new Coze({ api_key: apiKey });
  const v = await coze.chatV3Streaming({ query, bot_id: botId });

  for await (const part of v) {
    const event = part.event;
    if (event === 'done') {
      console.log(part.data);
      break;
    }

    const { message, is_finish } = part.data;
    if (
      message.role === "assistant" &&
      message.type === "answer" &&
      message.content_type === "text"
    ) {
      process.stdout.write(message.content);
      if (is_finish) {
        process.stdout.write("\n");
      }
    } else {
      console.log("[%s]:[%s]:%s", message.role, message.type, message.content);
    }
  }

  console.log('=== End of Streaming Chat V2 ===');
}

async function streamingChatV3() {
  console.log('=== Streaming Chat V3 ===');

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

  console.log('=== End of Streaming Chat V3 ===');
}

streamingChatV3().catch(console.error);