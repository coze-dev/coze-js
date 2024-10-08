/* eslint-disable no-unused-vars */
import { client, botId } from './client.mjs';
import { clearLine, cursorTo } from 'node:readline';

const query = '来一段有趣的代码';

async function streamingChat(callback) {
  const v = await client.chat.stream({
    bot_id: botId,
    user_id: '123',
    auto_save_history: false,
    additional_messages: [
      {
        role: 'user',
        content: query,
        content_type: 'text',
      },
    ],
  });

  for await (const part of v) {
    if (typeof part === 'string') {
      return;
    }
    if (part.event === 'conversation.chat.created') {
      console.log('[START]');
      callback && callback(part.data);
    } else if (part.event === 'conversation.message.delta') {
      process.stdout.write(part.data.content);
    } else if (part.event === 'conversation.message.completed') {
      const { role, type, content } = part.data;
      if (role === 'assistant' && type === 'answer') {
        process.stdout.write('\n');
      } else {
        console.log('[%s]:[%s]:%s', role, type, content);
      }
    } else if (part.event === 'conversation.chat.completed') {
      console.log(part.data.usage);
    } else if (part.event === 'done') {
      console.log(part.data);
    }
  }

  console.log('=== End of Streaming Chat ===');
}

async function sleep(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function nonStreamingChat() {
  console.log('=== Non-Streaming Chat ===');

  const v = await client.chat.create({
    bot_id: botId,
    user_id: '123',
    additional_messages: [
      {
        role: 'user',
        content: query,
        content_type: 'text',
      },
    ],
  });

  const chat_id = v.id;
  const conversation_id = v.conversation_id;
  while (true) {
    await sleep(100);
    const chat = await client.chat.retrieve(conversation_id, chat_id);
    if (chat.status === 'completed' || chat.status === 'failed' || chat.status === 'requires_action') {
      console.log(chat.usage);
      break;
    }
    const messageList = await client.chat.history(conversation_id, chat_id);
    if (messageList.length <= 0) {
      process.stdout.write('.');
    } else {
      clearLine(process.stdout, 0);
      cursorTo(process.stdout, 0);
      process.stdout.write('');
      for (const item of messageList) {
        console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
      }
    }
  }
}

// TODO  test
async function submitToolOutputs() {
  const v = await client.chat.submitToolOutputs({
    conversation_id: '123',
    chat_id: '123',
    tool_outputs: [{ id: '123', output: '123' }],
    stream: false,
  });
  console.log('client.chat.submitToolOutputs', v);
}

async function streamingCancel() {
  streamingChat(async v => {
    sleep(1000);
    const result = await client.chat.cancel(v.conversation_id, v.id);
    console.log('client.chat.cancel', result);
  });
}

async function main() {
  // await streamingChat();
  // await nonStreamingChat();
  streamingCancel();
}

main().catch(console.error);
