# Install

```bash
npm install @coze/api
or
yarn add @coze/api
```

# Usage

## Initialize the coze client

#### Fixed Auth Token

create Personal Auth Token at [扣子](https://www.coze.cn/open/oauth/pats) or [Coze Platform](https://www.coze.com/open/oauth/pats)

```js
import { CozeAPI } from '@coze/api';

# use pat or oauth token as auth
const client = new CozeAPI({
  token: 'your_token',
  baseURL: 'https://api.coze.com',
});
```

#### JWT OAuth App

create JWT OAuth App at [扣子](https://www.coze.cn/open/oauth/apps) or [Coze Platform](https://www.coze.com/open/oauth/apps)

```js
import { CozeAPI, getJWTToken } from '@coze/api';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const spaceId = '***0912839026278411';
const appId = '***14427';
const keyid = '***36E';
const aud = 'api.coze.com';

const privateKey = fs.readFileSync('private_key.pem');

const payload = {
  iss: appId,
  aud,
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 86399,
  jti: 'uuid-' + Date.now(),
};
jwt.sign(payload, privateKey, { algorithm: 'RS256', keyid }, async (err, token) => {
  console.log('jwtToken', token);
  const result = await getJWTToken({ baseURL, token, duration_seconds: 86399 });

  const client = new CozeAPI({ baseURL, token: result.access_token });
});
```

## chat (stream mode)

```js
import { CozeAPI } from '@coze/api';
import { clearLine, cursorTo } from 'node:readline';

const client = new CozeAPI({
  token: 'your_token',
  baseURL: 'https://api.coze.com',
});
const query = 'Hello';

async function streamingChat() {
  const v = await client.chat.stream({
    bot_id: botId,
    user_id: '123***',
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

streamingChat();
```

## chat (non-stream mode)

```js
import { CozeAPI } from '@coze/api';
import { clearLine, cursorTo } from 'node:readline';

const client = new CozeAPI({
  token: 'your_token',
  baseURL: 'https://api.coze.com',
});
const query = 'Hello';

async function nonStreamingChat() {
  console.log('=== Non-Streaming Chat ===');

  const v = await client.chat.create({
    bot_id: botId,
    user_id: '123***',
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
nonStreamingChat();
```

# How to contribute

## develop

```bash
pnpm install
pnpm run start  # for node
pnpm run start:web  # for web
```

## demo（node）

```bash
cd examples/node

COZE_API_KEY=pat_yQj30194fwX*** COZE_BOT_ID=7372391044761223175  COZE_BASE_URL=https://api.coze.com   node chat.mjs
```

## demo（browser）

```bash
cd examples/web
npm install
npm install @coze/coze-js -f # force re-install if code changed
npm run dev

```

## test

```bash
pnpm run test
```
