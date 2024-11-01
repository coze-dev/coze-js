import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'fs';

import { client } from './client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../tmp/voice.mp3');
const fileBuffer = await fs.createReadStream(filePath);

try {
  const voiceObj = await client.audio.voices.clone({
    audio_format: 'mp3',
    file: fileBuffer,
    voice_name: '湾湾小何2',
    preview_text:
      '今天天气真是太好了，阳光灿烂，心情超级棒，但是朋友最近的感情问题也让我心痛不已，好像世界末日一样，真的好为他难过。',
    voice_id: '742894224871836***',
  });
  console.log('client.audio.voices.clone', voiceObj);
} catch (error) {
  console.error('Failed to clone voice:', error.message);
}

try {
  const speechBuffer = await client.audio.speech({
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

  await fs.writeFileSync(audioPath, speechBuffer, 'binary');
  console.log('Speech saved successfully:', audioPath);
} catch (error) {
  console.error('Failed to generate or save speech:', error.message);
}

async function listAllVoices() {
  try {
    const PAGE_SIZE = 20;
    let page = 1;
    let allVoices = [];

    while (true) {
      console.log('page', page);
      const response = await client.audio.voices.list({
        page_size: PAGE_SIZE,
        page_num: page,
      });
      allVoices = allVoices.concat(response.voice_list);
      console.log('response', response);
      if (response.has_more === false) {
        break;
      }
      page++;
    }

    console.log(`Total voices found: ${allVoices.length}`);
    return allVoices;
  } catch (error) {
    console.error('Failed to list voices:', error.message);
  }
}

await listAllVoices();
