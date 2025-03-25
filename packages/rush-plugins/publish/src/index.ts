import path from 'path';
import fs from 'fs';

import { Command } from 'commander';

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

  [generateChangeAction].forEach(a => {
    a(program);
  });

  program.parse();
};

main();
