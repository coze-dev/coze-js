import path from 'path';
import fs from 'fs';

import { Command } from 'commander';

import { installAction as releaseAction } from './action/release';
import { installAction as publishAction } from './action/publish';
import { installAction as generateChangeAction } from './action/change';

const main = () => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'),
  );
  const program = new Command();

  program
    .name(packageJson.name)
    .description(packageJson.description)
    .version(packageJson.version)
    .showSuggestionAfterError(true)
    .showHelpAfterError(true);

  const actions = [generateChangeAction, releaseAction, publishAction];

  actions.forEach(a => {
    a(program);
  });

  program.parse();
};

main();
