import { client } from './client';

async function main() {
  const templateId = '7418160152504827942';
  const workspaceId = '7330912839026278411';
  const result = await client.templates.duplicate(templateId, {
    workspace_id: workspaceId,
    name: 'new-template-name',
  });
  console.log('client.templates.duplicate', result);
}

main().catch(console.error);
