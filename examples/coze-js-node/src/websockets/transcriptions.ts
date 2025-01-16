import fs from 'fs';

import { WebsocketsEventType } from '@coze/api';

import { client } from '../client.js';

async function main() {
  const ws = await client.websockets.audio.transcriptions.create({
    maxRetries: 3,
  });

  ws.onopen = event => {
    console.log('on open');

    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.TRANSCRIPTIONS_UPDATE,
      data: {
        input_audio: {
          format: 'pcm',
          codec: 'pcm',
          sample_rate: 24000,
          channel: 1,
          bit_depth: 16,
        },
      },
    });

    // Read audio_data.txt file
    const audioData = fs.readFileSync('audio_data.txt', 'utf-8');
    // Split audio data by lines
    const audioLines = audioData.split('\n');

    // Send audio data line by line
    for (const line of audioLines) {
      ws.send({
        id: 'event_id',
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_APPEND,
        data: {
          delta: line,
        },
      });
    }

    ws.send({
      id: 'event_id',
      event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_COMPLETE,
    });

    // Clear buffer
    setTimeout(() => {
      ws.send({
        id: 'event_id',
        event_type: WebsocketsEventType.INPUT_AUDIO_BUFFER_CLEAR,
      });
      ws.close();
    }, 5000);
  };

  ws.onmessage = (data, event) => {
    console.log('on message');
    if (data.event_type === WebsocketsEventType.TRANSCRIPTIONS_MESSAGE_UPDATE) {
      console.log('content', data.data.content);
    }
  };

  ws.onerror = (error, event) => {
    if (error.data.code === 401) {
      console.error('Unauthorized Error', error);
    } else if (error.data.code === 403) {
      console.error('Forbidden Error', error);
    } else {
      console.error('WebSocket error', error);
    }
    ws.close();
  };

  ws.onclose = () => {
    console.log('on close');
  };
}

main();
