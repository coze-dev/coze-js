import { client } from './client.mjs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const file = await client.files.create(join(__dirname, 'test.pdf'));
console.log('client.files.create', file);

const file2 = await client.files.retrieve({ file_id: file.id });
console.log('client.files.retrieve', file2);
