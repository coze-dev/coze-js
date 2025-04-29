import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import { RoleType } from '@coze/api';

import { handleStream } from './utils';
import { client, botId } from './client';

async function chatWithImage() {
  const fileObj = await fileUpload();
  const result = await client.chat.stream({
    bot_id: botId,
    auto_save_history: true,
    additional_messages: [
      {
        role: RoleType.User,
        content: [
          {
            type: 'text',
            text: 'What is in the image?',
          },
          {
            type: 'image',
            file_id: fileObj.id,
          },
        ],
        content_type: 'object_string',
      },
    ],
  });
  await handleStream(result);
}

async function fileUpload() {
  const filename = fileURLToPath(import.meta.url);
  const filePath = join(dirname(filename), '../tmp/test.png');

  const fileBuffer = await fs.createReadStream(filePath);

  const fileObj = await client.files.upload({ file: fileBuffer });

  return fileObj;
}

chatWithImage().catch(console.error);
