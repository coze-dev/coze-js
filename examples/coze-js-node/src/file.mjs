import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'fs';

import { client } from './client.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, '../tmp/test.docx');
const fileBuffer = await fs.createReadStream(filePath);

const fileObj = await client.files.upload({ file: fileBuffer });
console.log('client.files.upload', fileObj);

const file2 = await client.files.retrieve(fileObj.id);
console.log('client.files.retrieve', file2);
