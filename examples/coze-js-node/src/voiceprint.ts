import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

import { client } from './client';

async function voiceprintGroup() {
  const group = await client.audio.voiceprintGroups.create({
    name: 'test',
    desc: 'desc',
  });
  console.log('client.audio.voiceprintGroups.create', group);

  const update = await client.audio.voiceprintGroups.update(group.id, {
    name: 'test2',
    desc: 'desc2',
  });
  console.log('client.audio.voiceprintGroups.update', update);

  const list = await client.audio.voiceprintGroups.list();
  console.log('client.audio.voiceprintGroups.list', list);
}

async function voiceprintGroupFeature(groupId: string) {
  const filename = fileURLToPath(import.meta.url);
  const filePath = join(dirname(filename), '../tmp/audio.pcm');
  const file = await fs.createReadStream(filePath);

  const feature = await client.audio.voiceprintGroups.features.create(groupId, {
    file,
    name: `featrue test${Date.now()}`,
    desc: 'feature desc',
    sample_rate: 48000,
    channel: 1,
  });
  console.log('client.audio.voiceprintGroups.features.create', feature);

  const list = await client.audio.voiceprintGroups.features.list(groupId);
  console.log('client.audio.voiceprintGroups.features.list', list);

  const update = await client.audio.voiceprintGroups.features.update(
    groupId,
    feature.id,
    {
      file,
      name: `featrue test${Date.now()}`,
      desc: 'feature desc',
    },
  );
  console.log('client.audio.voiceprintGroups.features.update', update);

  const speakerIdentify =
    await client.audio.voiceprintGroups.features.speakerIdentify(groupId, {
      file,
      top_k: 5,
      sample_rate: 48000,
      channel: 1,
    });
  console.log(
    'client.audio.voiceprintGroups.features.speakerIdentify',
    speakerIdentify,
  );

  const deleteFeature = await client.audio.voiceprintGroups.features.delete(
    groupId,
    feature.id,
  );
  console.log('client.audio.voiceprintGroups.features.delete', deleteFeature);
}

voiceprintGroup().catch(console.error);
voiceprintGroupFeature('7510158666260267052').catch(console.error);
