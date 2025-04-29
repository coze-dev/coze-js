/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'fs';

import { type Voice } from '@coze/api';

import { client } from './client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../tmp/voice.mp3');
const fileBuffer = await fs.createReadStream(filePath);

async function voiceClone() {
  const voiceObj = await client.audio.voices.clone({
    audio_format: 'mp3',
    file: fileBuffer as any,
    voice_name: '湾湾小何2',
    preview_text:
      '今天天气真是太好了，阳光灿烂，心情超级棒，但是朋友最近的感情问题也让我心痛不已，好像世界末日一样，真的好为他难过。',
    voice_id: '742894224871836***',
    space_id: '742403634451716***',
    description: '',
  });
  console.log('client.audio.voices.clone', voiceObj);
}

async function createSpeech() {
  const speechBuffer = await client.audio.speech.create({
    input:
      '今天天气真是太好了，阳光灿烂，心情超级棒，但是朋友最近的感情问题也让我心痛不已，好像世界末日一样，真的好为他难过。',
    voice_id: '742894224871836***',
    response_format: 'mp3',
  });
  const audioPath = join(__dirname, '../tmp/speech.mp3');
  // Check if file exists to prevent accidental overwrites
  if (fs.existsSync(audioPath)) {
    console.warn(`Warning: Overwriting existing file at ${audioPath}`);
  }

  await fs.writeFileSync(audioPath, speechBuffer as any, 'binary');
  console.log('Speech saved successfully:', audioPath);
}

async function listAllVoices() {
  const PAGE_SIZE = 20;
  let page = 1;
  let allVoices: Voice[] = [];

  while (true) {
    const response = await client.audio.voices.list({
      page_size: PAGE_SIZE,
      page_num: page,
    });
    allVoices = allVoices.concat(response.voice_list);
    if (response.has_more === false) {
      break;
    }
    page++;
  }

  console.log(`Total voices found: ${allVoices.length}`);
  return allVoices;
}

async function voiceTranslation() {
  // const filePath = join(__dirname, '../tmp/voice.mp3');
  // const fileBuffer = await fs.createReadStream(filePath);

  const voiceObj = await client.audio.transcriptions.create({
    file: fileBuffer as any,
  });
  console.log('client.audio.transcriptions.create', voiceObj);
}

await voiceClone().catch(console.error);
await createSpeech().catch(console.error);
await listAllVoices().catch(console.error);
await voiceTranslation().catch(console.error);
