
# Coze API SDK
[![npm version](https://img.shields.io/npm/v/%40coze%2Fapi)](https://www.npmjs.com/package/@coze/api)
[![npm downloads](https://img.shields.io/npm/dm/%40coze%2Fapi)](https://www.npmjs.com/package/@coze/api)
[![bundle size](https://img.shields.io/bundlephobia/min/%40coze%2Fapi)](https://bundlephobia.com/package/@coze/api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

English | [简体中文](./README.zh-CN.md)

Official Node.js and Browser SDK for [Coze](https://www.coze.com)（or [扣子](https://www.coze.cn)） API platform.

## Quick Start

### 1. Installation


```sh
npm install @coze/api
# or
pnpm install @coze/api
```

### 2. Basic Usage

```javascript
import { CozeAPI, COZE_COM_BASE_URL, ChatStatus, RoleType } from '@coze/api';

// Initialize client with your Personal Access Token
const client = new CozeAPI({
  token: 'your_pat_token', // Get your PAT from https://www.coze.com/open/oauth/pats
  // or
  // token: async () => {
  //   // refresh token if expired
  //   return 'your_oauth_token';
  // },
  baseURL: COZE_COM_BASE_URL,
});

// Simple chat example
async function quickChat() {
  const v = await client.chat.createAndPoll({
    bot_id: 'your_bot_id',
    additional_messages: [{
      role: RoleType.User,
      content: 'Hello!',
      content_type: 'text',
    }],
  });

    if (v.chat.status === ChatStatus.COMPLETED) {
    for (const item of v.messages) {
      console.log('[%s]:[%s]:%s', item.role, item.type, item.content);
    }
    console.log('usage', v.chat.usage);
  }
}
```

## More Examples

| Feature | Description | Example |
|---------|-------------|----------|
| Chat | Text conversations | [chat.ts](../../examples/coze-js-node/src/chat.ts) |
| Chat | Chat With Local Plugin | [chat-local-plugin.ts](../../examples/coze-js-node/src/chat-local-plugin.ts)|
| Chat | Chat With File(Image) | [chat-with-file.ts](../../examples/coze-js-node/src/chat-with-file.ts) |
| Bot Management | Create and manage bots | [bot.ts](../../examples/coze-js-node/src/bot.ts) |
| Datasets | Document management | [datasets.ts](../../examples/coze-js-node/src/datasets.ts) |
| Workflow | Run workflow | [workflow.ts](../../examples/coze-js-node/src/workflow.ts) |
| Variables | Variable management | [variables.ts](../../examples/coze-js-node/src/variables.ts) |
| Voice | Speech synthesis | [voice.ts](../../examples/coze-js-node/src/voice.ts) |
| Templates | Template management | [templates.ts](../../examples/coze-js-node/src/templates.ts) |
| Users | Get user info | [users-me.ts](../../examples/coze-js-node/src/users-me.ts) |
| Voiceprint | Voiceprint management | [voiceprint.ts](../../examples/coze-js-node/src/voiceprint.ts) |
| Chat（websocket） | Text and voice chat | [chat.ts](../../examples/coze-js-node/src/websockets/chat.ts) |
| Speech（websocket） | Text to speech | [speech.ts](../../examples/coze-js-node/src/websockets/speech.ts) |
| Transcriptions（websocket） | Speech to text | [transcriptions.ts](../../examples/coze-js-node/src/websockets/transcriptions.ts) |
[View all examples →](../../examples/coze-js-node/src/)
[Websocket Events →](https://bytedance.larkoffice.com/docx/Uv6Wd8GTjoEex3xyq4YcxDnRnkc)

## Key Features

- 🌐 **Full API Support**: Covers all [Coze Open Platform APIs](https://www.coze.com/docs/developer_guides/api_overview)
- 🔐 **Multiple Auth Methods**: PAT, OAuth, JWT, OAuth PKCE
- 🔄 **Streaming Support**: Real-time responses for chat and workflow
- 🔄 **Websocket Support**: Real-time responses for chat, speech, and transcriptions
- 🌍 **Cross-Platform**: Works in Node.js (≥14) and modern browsers
- ⚙️ **Configurable**: Timeout, headers, signal, debug options

## Authentication Options

1. **Personal Access Token (Simplest)**
```javascript
const client = new CozeAPI({
  token: 'your_pat_token',
  baseURL: COZE_COM_BASE_URL, // Use COZE_CN_BASE_URL for China region
});
```

2. **Other Auth Methods**
- OAuth Web Application
- OAuth PKCE
- JWT
- Device Code Flow

[View authentication examples →](../../examples/coze-js-node/src/auth/)

## Advanced Usage

### Streaming Chat
```javascript
import { CozeAPI, ChatEventType, RoleType } from '@coze/api';

async function streamChat() {
  const stream = await client.chat.stream({
    bot_id: 'your_bot_id',
    additional_messages: [{
      role: RoleType.User,
      content: 'Hello!',
      content_type: 'text',
    }],
  });

  for await (const part of stream) {
    if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
      process.stdout.write(part.data.content); // Real-time response
    }
  }
}
```

### Websocket Chat
```javascript
import { CozeAPI, RoleType, WebsocketsEventType } from '@coze/api';

async function wsChat() {
  const ws = await client.websockets.chat.create('your_bot_id');

  ws.onopen = () => {
    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.CHAT_UPDATE,
      data: {
        chat_config: {
          auto_save_history: true,
          user_id: 'uuid',
          meta_data: {},
          custom_variables: {},
          extra_params: {},
        },
      },
    });

    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
      data: {
        role: RoleType.User,
        content: 'tell me a joke',
        content_type: 'text',
      },
    });
  };

  ws.onmessage = (data, event) => {
    if (data.event_type === WebsocketsEventType.ERROR) {
      if (data.data.code === 4100) {
        console.error('Unauthorized Error', data);
      } else if (data.data.code === 4101) {
        console.error('Forbidden Error', data);
      } else {
        console.error('WebSocket error', data);
      }
      ws.close();
      return;
    }

    if (data.event_type === WebsocketsEventType.CONVERSATION_MESSAGE_DELTA) {
      console.log('on message delta', data.data);
    } else if (
      data.event_type === WebsocketsEventType.CONVERSATION_CHAT_COMPLETED
    ) {
      console.log('on chat completed', data.data);
    }
  };

  ws.onerror = error => {
    console.error('WebSocket error', error);
    ws.close();
  };
}
```

### Websocket Chat SDK
if you want to use the realtime chat sdk in web, you can use the following code:
Online Demo: URL_ADDRESS.coze.cn/open-platform/realtime/websocket
```typescript
import { WsChatClient, WsChatEventNames, type WsChatEventData } from '@coze/api/ws-tools';
import { WebsocketsEventType, RoleType } from '@coze/api';

try {
  // Initialize
  const client = new WsChatClient({
    botId: 'your_bot_id',
    token: 'your_auth_token',
    voiceId: 'your_voice_id', // optional
    allowPersonalAccessTokenInBrowser: true, // optional default is false
    debug: false, // optional default is false
  });

  await client.connect();
} catch (error) {
  console.error('error', error);
}

// listen for all events
client.on(WsChatEventNames.ALL, (eventName: string, event: WsChatEventData) => {
  console.log(event);
});

// send user message
client.sendMessage({
  id: 'event_id',
  event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
  data: {
    role: RoleType.User,
    content: 'Hello World',
    content_type: 'text',
  },
});

// interrupt chat
client.interrupt();

// disconnect
await client.disconnect();

// set audio enable
await client.setAudioEnable(false);

// set audio input device
await client.setAudioInputDevice('your_device_id');

// set playback volume
client.setPlaybackVolume(0.5);

// get playback volume
const volume = client.getPlaybackVolume();

```


### Proxy Example
```ts
const client = new CozeAPI({
  token: '', // use proxy token in server
  baseURL: 'http://localhost:8080/api',
});
```
[View proxy example →](../../examples/coze-js-node/src/proxy/)


### Websocket Speech SDK
Online Demo: Online Demo: URL_ADDRESS.coze.cn/open-platform/realtime/websocket#speech
```javascript
import { WsSpeechClient } from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';
// Initialize
const client = new WsSpeechClient({
  token: 'your_pat_token',
  baseWsURL: COZE_CN_BASE_WS_URL,
  allowPersonalAccessTokenInBrowser: true, // optional
});

// Listen for all downstream events (including error)
client.on('data', data => {
  console.log('[speech] ws data', data);
});

// Or, listen for a single event
client.on(WebsocketsEventType.ERROR, data => {
  console.error('[speech] ws error', data);
});

// Listen for playback completed event, if manually called disconnect, this event will not be triggered
client.on('completed', () => {
  console.log('[speech] playback completed');
});

// Connect
try {
  await client.connect({voiceId: 'your_voice_id'});
  console.log('[speech] ws connect success');
} catch (error) {
  console.error('[speech] ws connect error', error);
  return;
}

// Send message and play
client.appendAndComplete('Hello, Coze!');

// Interrupt
await client.interrupt();


// Pause speech playback
client.pause();

// Resume speech playback
client.resume();

// Toggle speech playback
client.togglePlay();

// Check if speech is playing
client.isPlaying();

// Disconnect, destroy instance
client.disconnect();

// Send text fragment
client.append('Hello,');
client.append(' Coze!');
// End sending text
client.complete();

```

### Websocket Transcriptions SDK
Online Demo: https://www.coze.cn/open-platform/realtime/websocket#transcription
```javascript
import { WsTranscriptionClient } from '@coze/api/ws-tools';
import { WebsocketsEventType } from '@coze/api';
// Initialize
const client = new WsTranscriptionClient({
  token: 'your_pat_token',
  allowPersonalAccessTokenInBrowser: true, // optional
});

// Listen for all downstream events (including error)
client.on(WebsocketsEventType.ALL, data => {
  console.log('[transcription] ws data', data);
});

// Or, listen for a single event
client.on(WebsocketsEventType.ERROR, data => {
  console.error('[transcription] ws error', data);
});

// Listen for transcription update result
client.on(WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE, (event) => {
  console.log('[transcription] result', event.data.content);
});

// Connect
try {
  await client.start();
} catch (error) {
  console.error('[transcription] error', error);
}

// Stop transcription
client.stop();


// Pause transcription
client.pause();

// Resume transcription
client.resume();


// destroy instance
client.destroy();

```

## Development

```bash
# Install dependencies
rush update  # If `rush` command is not installed, see ../../README.md

# Run tests
npm run test
```

## Try Examples

### Node.js
```bash
cd examples/coze-js-node
npm run run-preinstall
npm install
npx tsx ./src/chat.ts

# For China region (api.coze.cn)
COZE_ENV=zh npx tsx ./src/chat.ts            # macOS/Linux
set "COZE_ENV=zh" && npx tsx ./src/chat.ts   # Windows CMD
$env:COZE_ENV="zh"; npx tsx ./src/chat.ts    # Windows PowerShell
```

### Browser
```bash
cd examples/coze-js-web
rush build
npm start
```

## Documentation

For detailed API documentation and guides, visit:
- [API Overview](https://www.coze.com/docs/developer_guides/api_overview)
- [Authentication Guide](https://www.coze.com/docs/developer_guides/authentication)
