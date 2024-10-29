# Introduction

The Coze API SDK for Node or Browser is a versatile tool for integrating Coze's open APIs into your projects.

- [Supports all Coze Open Platform APIs](https://www.coze.com/docs/developer_guides/api_overview?_lang=en)
- [Supports multiple authentication methods (PAT, OAuth, JWT, OAuth PKCE)](https://www.coze.com/docs/developer_guides/authentication?_lang=en)
- Supports Node.js and modern browsers
- Some interfaces support both streaming and non-streaming data (e.g., chat, workflow)
- Uses an API design similar to the OpenAI SDK
- Supports configurations such as timeout, headers, signal, and debug

# Requirements

- Node.js: >=14

# Install

```sh
npm install @coze/api
```

# Usage

## Examples

| Example                                          | File                                              |
| ------------------------------------------------ | ------------------------------------------------- |
| Personal Access Token authentication             | examples/node/src/auth/auth-pat.mjs               |
| OAuth Web application authentication             | examples/node/src/auth/auth-oauth-web.mjs         |
| OAuth PKCE authentication                        | examples/node/src/auth/auth-oauth-pkce.mjs        |
| OAuth JWT authentication                         | examples/node/src/auth/auth_oauth_jwt.mjs         |
| OAuth JWT authentication for channel access      | examples/node/src/auth/auth-oauth-jwt-channel.mjs |
| OAuth Device Code flow authentication            | examples/node/src/auth/auth-oauth-device.mjs      |
| Chat (streaming and non-streaming)               | examples/node/src/chat.mjs                        |
| Bot creation and management                      | examples/node/src/bot.mjs                         |
| File operations                                  | examples/node/src/file.mjs                        |
| Knowledge base document management               | examples/node/src/knowledge.mjs                   |
| Workspace listing                                | examples/node/src/workspace.mjs                   |
| Conversation management                          | examples/node/src/conversation.mjs                |
| Workflow execution (streaming and non-streaming) | examples/node/src/workflow.mjs                    |
| Error handling examples                          | examples/node/src/error-handle.mjs                |
| Request options (Support all axios options)      | examples/node/src/request-options.mjs             |

## Initialize the coze client

### Fixed Auth Token

create Personal Auth Token at [扣子](https://www.coze.cn/open/oauth/pats) or [Coze Platform](https://www.coze.com/open/oauth/pats)

```js
import { CozeAPI,COZE_COM_BASE_URL ,COZE_CN_BASE_URL } from '@coze/api';

const client = new CozeAPI({
  token: 'your_token',
  baseURL: COZE_COM_BASE_URL, // you can change to COZE_CN_BASE_URL if you use https://use coze.cn
});
```

### OAuth、JWT 和 Device Code

支持 OAuth 2.0 、 JWT 和 Device Code 等多种认证方式，请参考：

- [auth-oauth-web](./examples/node/src/auth/auth-oauth-web.mjs)
- [auth-oauth-pkce](./examples/node/src/auth/auth-oauth-pkce.mjs)
- [auth-oauth-jwt](./examples/node/src/auth/auth-oauth-jwt.mjs)
- [auth-oauth-jwt-channel](./examples/node/src/auth/auth-oauth-jwt-channel.mjs)
- [auth-oauth-device](./examples/node/src/auth/auth-oauth-device.mjs)

## chat (stream mode)

Call the coze.chat.stream method to create a chat. The create method is a streaming chat and will return a Chat Iterator. Developers should iterate the iterator to get chat event and handle them.

```js
import { CozeAPI, ChatEventType,COZE_COM_BASE_URL } from '@coze/api';
import { clearLine, cursorTo } from 'node:readline';

const client = new CozeAPI({
  token: 'your_token',
  baseURL: COZE_COM_BASE_URL,
});
const query = 'Hello';

async function streamingChat() {
  const v = await client.chat.stream({
    bot_id: botId,
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
    if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
      console.log('[START]');
      callback && callback(part.data);
    } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      process.stdout.write(part.data.content);
    } else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED) {
      const { role, type, content } = part.data;
      if (role === 'assistant' && type === 'answer') {
        process.stdout.write('\n');
      } else {
        console.log('[%s]:[%s]:%s', role, type, content);
      }
    } else if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
      console.log(part.data.usage);
    } else if (part.event === ChatEventType.DONE) {
      console.log(part.data);
    }
  }

  console.log('=== End of Streaming Chat ===');
}

streamingChat();
```

## chat (non-stream mode)

To simplify the call, the SDK provides a wrapped function to complete non-streaming chat, polling, and obtaining the messages of the chat. Developers can use create_and_poll to simplify the process.

```js
import { CozeAPI, ChatStatus,COZE_COM_BASE_URL } from '@coze/api';

const client = new CozeAPI({
  token: 'your_token',
  baseURL: COZE_COM_BASE_URL,
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

  const v = await client.chat.createAndPoll({
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
  if (v.chat.status === ChatStatus.COMPLETED) {
    for (const item of v.messages) {
      console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
    }
    console.log('usage', v.chat.usage);
  }
}
nonStreamingChat();
```

## other examples

- [bot](./examples/node/src/bot.mjs)
- [file](./examples/node/src/file.mjs)
- [knowledge](./examples/node/src/knowledge.mjs)
- [conversation](./examples/node/src/conversation.mjs)
- [workflow](./examples/node/src/workflow.mjs)
- [error-handle](./examples/node/src/error-handle.mjs)
- [request-options](./examples/node/src/request-options.mjs)

# How to contribute

## develop

```bash
pnpm install
pnpm run start
```

## demo（node）

```bash
cd examples/node
npm install
cp config.default.js config.js
# and then edit config.js to use your PAT and other params

node chat.mjs
// or
COZE_ENV=zh node chat.mjs
```

## demo（browser）

```bash
cd examples/web
npm install
npm run start

```

## test

```bash
pnpm run test
```
