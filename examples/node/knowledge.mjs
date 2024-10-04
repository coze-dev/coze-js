import { client } from './client.mjs';
import fs from 'fs';
async function main() {
  const file = fs.readFileSync('test.txt');
  const fileBase64 = file.toString('base64');

  const create = await client.knowledge.documents.create({
    dataset_id: '7421572319993495569',
    document_bases: [
      {
        name: 'test.txt',
        source_info: {
          file_base64: fileBase64,
          file_type: 'txt',
        },
      },
    ],
    chunk_strategy: {
      chunk_type: 0,
    },
  });
  console.log('client.knowledge.documents.create', create);

  const update = await client.knowledge.documents.update({
    document_id: create[0].document_id,
    document_name: 'test2.txt',
  });
  console.log('client.knowledge.documents.update', update);

  await client.knowledge.documents.delete({ document_ids: [create[0].document_id] });

  const list = await client.knowledge.documents.list({ dataset_id: '7421572319993495569', page: 1, page_size: 10 });
  console.log('client.knowledge.documents.list', list);
}

main();
