import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import Speaker from 'speaker';
import { RoleType, WebsocketsEventType } from '@coze/api';

import { client, botId } from '../client';

const filename = fileURLToPath(import.meta.url);
const filePath = join(dirname(filename), '../../tmp/pcm.txt');

async function textChat() {
  const ws = await client.websockets.chat.create({
    bot_id: botId,
  });

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

async function voiceChat() {
  const ws = await client.websockets.chat.create(
    {
      bot_id: botId,
    },
    {
      headers: {},
    },
  );
  const eventSet = new Set();

  const speaker = new Speaker({
    channels: 1, // mono channel
    bitDepth: 16, // 16-bit
    sampleRate: 24000, // sample rate
  });

  ws.onopen = () => {
    console.log('on open');

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
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
          sample_rate: 24000,
          channel: 1,
          bit_depth: 16,
        },
        output_audio: {
          codec: 'pcm',
          pcm_config: {
            sample_rate: 24000,
          },
          speech_rate: 0,
          // voice_id: '',
        },
      },
    });

    // Submit conversation content
    // ws.send({
    //   id: 'event_id',
    //   event_type: WebsocketsEventType.CONVERSATION_MESSAGE_CREATE,
    //   data: {
    //     role: 'user', // user/assistant
    //     content_type: 'object_string', // text/object_string
    //     content:
    //       '[{"type":"text","text":"帮我看看这个PDF里有什么内容？"},{"type":"file","file_url":"https://lf3-appstore-sign.oceancloudapi.com/ocean-cloud-tos/eaafba63-0d96-4ea6-b60c-fbadcf2c25e9.?lk3s=edeb9e45&x-expires=1718296132&x-signature=YtlsUsvSeLJi6x31I%2F4S9X53Y6Y%3D"}]',
    //   },
    // });

    // // Clear context
    // ws.send({
    //   id: 'event_id',
    //   event_type: WebsocketsEventType.CONVERSATION_CLEAR,
    // });

    // Read audio_data.txt file
    const audioData = fs.readFileSync(filePath, 'utf-8');
    // Split audio data by lines
    const audioLines = audioData.split('\n');

    // Stream upload audio fields
    for (const line of audioLines) {
      // await new Promise(resolve => setTimeout(resolve, 100));
      ws.send({
        id: 'event_id',
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
        data: {
          delta: line,
        },
      });
    }

    setTimeout(() => {
      // Clear audio buffer
      // ws.send({
      //   id: 'event_id',
      //   event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_CLEAR,
      // });
    }, 1000);

    // Submit audio
    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
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

    eventSet.add(data.event_type);
    if (data.event_type === WebsocketsEventType.CONVERSATION_AUDIO_DELTA) {
      const buffer = Buffer.from(data.data.content, 'base64');
      speaker.write(buffer);
    } else if (
      data.event_type === WebsocketsEventType.CONVERSATION_CHAT_COMPLETED
    ) {
      speaker.end();
      console.log('eventSet', eventSet);
    }
  };

  ws.onerror = error => {
    console.error('WebSocket error', error);
    ws.close();
  };

  // Cleanup
  // ws.onclose = () => {};
}

textChat();
voiceChat();
