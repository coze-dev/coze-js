/* eslint-disable @typescript-eslint/naming-convention */
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import fs from 'fs';

import { client, sleep, spaceId } from './client';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function fileUpload(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const fileBuffer = await fs.createReadStream(filePath);

  const fileObj = await client.files.upload({ file: fileBuffer });

  console.log('client.files.upload', fileObj);

  return fileObj;
}

async function dataset() {
  const filePath = join(__dirname, '../tmp/icon.png');
  const fileObj = await fileUpload(filePath);

  const create = await client.datasets.create({
    name: 'test',
    space_id: spaceId,
    format_type: 2,
    description: 'test',
    file_id: fileObj.id,
  });

  console.log('client.datasets.create', create);

  const update = await client.datasets.update(create.dataset_id, {
    name: 'test2',
    description: 'test2',
  });
  console.log('client.datasets.update', update);

  const list = await client.datasets.list({
    space_id: spaceId,
    name: 'tes', // optional
    format_type: 0, // optional
    page_num: 1, // optional
    page_size: 10, // optional
  });
  console.log('client.datasets.list', list);

  // test document
  await document(create.dataset_id);

  const images = await client.datasets.images.list(create.dataset_id);
  console.log('client.datasets.images.list', images);

  await client.datasets.delete(create.dataset_id);
}

async function document(datasetId: string) {
  const filePath = join(__dirname, '../tmp/test.png');
  const fileObj = await fileUpload(filePath);

  const create = await client.datasets.documents.create({
    dataset_id: datasetId,
    document_bases: [
      {
        name: 'test.png',
        source_info: {
          source_file_id: fileObj.id,
          document_source: 5,
        },
      },
    ],
    chunk_strategy: {
      chunk_type: 0,
    },
    format_type: 2,
  });
  console.log('client.datasets.documents.create', create);

  const update = await client.datasets.documents.update({
    document_id: create[0].document_id,
    document_name: 'test2.png',
  });
  console.log('client.datasets.documents.update', update);

  const MAX_RETRIES = 30; // 30 seconds timeout
  let retries = 0;
  while (true) {
    const process = await client.datasets.process(datasetId, {
      document_ids: [create[0].document_id],
    });
    console.log('client.datasets.process', process);
    if (process.data[0].status === 1) {
      break;
    }
    await sleep(1000);
    retries++;
    if (retries >= MAX_RETRIES) {
      throw new Error('Timeout waiting for document processing to complete');
    }
  }

  const updateCaption = await client.datasets.images.update(
    datasetId,
    create[0].document_id,
    {
      caption: 'test2',
    },
  );
  console.log('client.datasets.images.update', updateCaption);

  const list = await client.datasets.documents.list({
    dataset_id: datasetId,
    page: 1,
    page_size: 10,
  });
  console.log('client.datasets.documents.list', list);

  await client.datasets.documents.delete({
    document_ids: [create[0].document_id],
  });
}

dataset().catch(console.error);
