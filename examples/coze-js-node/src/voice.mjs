import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'fs';

import { client } from './client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../tmp/voice.mp3');
const fileBuffer = await fs.createReadStream(filePath);

const voiceObj = await client.audio.voices.clone({
  audio_format: 'mp3',
  file: fileBuffer,
  voice_name: '湾湾小何2',
  preview_text:
    '今天天气真是太好了，阳光灿烂，心情超级棒，但是朋友最近的感情问题也让我心痛不已，好像世界末日一样，真的好为他难过。',
  voice_id: '7428942248718368802',
});
console.log('client.audio.voices.clone', voiceObj);

const speechBuffer = await client.audio.speech({
  input:
    '今天天气真是太好了，阳光灿烂，心情超级棒，但是朋友最近的感情问题也让我心痛不已，好像世界末日一样，真的好为他难过。',
  voice_id: '7428942248718368802',
  response_format: 'mp3',
});
// Write to local file
const audioPath = join(__dirname, '../tmp/speech.mp3');
await fs.writeFileSync(audioPath, speechBuffer, 'binary');
console.log('client.audio.speech', audioPath);

const voices = await client.audio.voices.list({ page_size: 2 });
console.log('client.audio.voices.list', voices.voice_list.length);
