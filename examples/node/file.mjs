import { client } from './client.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { basename } from 'node:path';
import { readFile } from 'node:fs/promises';
import { File } from 'undici';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, 'test.pdf');
const fileBuffer = await readFile(filePath);
const file = new File([fileBuffer], basename(filePath));

const fileObj = await client.files.create({ file });
console.log('client.files.create', fileObj);

const file2 = await client.files.retrieve({ file_id: fileObj.id });
console.log('client.files.retrieve', file2);
