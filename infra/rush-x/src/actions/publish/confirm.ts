import chalk from 'chalk';
import { confirm } from '@inquirer/prompts';

import { type PublishManifest } from './version';

export const confirmForPublish = async (
  publishManifest: PublishManifest[],
  dryRun: boolean,
): Promise<boolean> => {
  console.log(chalk.gray('Will publish the following packages:'));
  publishManifest.forEach(manifest => {
    const msg = `${manifest.project.packageName}: ${chalk.bgGreen(`${manifest.currentVersion} -> ${chalk.bold(manifest.newVersion)}`)}`;
    console.log(`- ${msg}`);
  });
  if (dryRun) {
    return false;
  }

  console.log('\n');
  try {
    const result = await confirm({
      message: 'Are you sure to publish?',
      default: true,
    });
    return result;
  } catch (error) {
    return false;
  }
};
