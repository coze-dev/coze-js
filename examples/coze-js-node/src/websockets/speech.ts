import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import Speaker from 'speaker';
import { WebsocketsEventType } from '@coze/api';

import { client } from '../client.js';

const filename = fileURLToPath(import.meta.url);
const filePath = join(dirname(filename), '../../tmp/pcm.txt');

if (fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '');
}

async function main() {
  const ws = await client.websockets.audio.speech.create();

  // Create speaker instance
  const speaker = new Speaker({
    channels: 1, // Mono channel
    bitDepth: 16, // 16-bit
    sampleRate: 24000, // Sample rate
  });

  speaker.on('error', err => {
    console.error('Speaker error:', err);
  });

  ws.onopen = event => {
    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.SPEECH_UPDATE,
      data: {
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

    setTimeout(() => {
      ws.send({
        id: 'event_id',
        event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_APPEND,
        data: {
          delta:
            '本文档介绍如何通过 WebSocket 协议实时访问扣子的流式大模型语音识别、大模型语音合成、多模态流式大模型 chat。',
        },
      });
    }, 1000);

    setTimeout(() => {
      // ws.send({
      //   id: 'event_id',
      //   event_type: WebsocketsEventType.INPUT_TEXT_BUFFER_COMPLETE,
      //   data: {},
      // });
    }, 5000);
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

    console.log('on message', data);

    if (data.event_type === WebsocketsEventType.SPEECH_AUDIO_UPDATE) {
      const audio = data.data.delta;

      // Write base64 audio data to file, one line per data
      fs.appendFileSync(filePath, `${audio}\n`, 'utf-8');

      const buffer = Buffer.from(audio, 'base64');

      speaker.write(buffer);
    } else if (data.event_type === WebsocketsEventType.SPEECH_AUDIO_COMPLETED) {
      speaker.end();
    } else {
      console.log('on message', data);
    }
  };

  ws.onerror = (error, event) => {
    console.error('WebSocket error', error);
    ws.close();
  };

  // Cleanup
  ws.onclose = () => {
    console.log('on close');
  };
}

main();
