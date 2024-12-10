import { Command } from 'commander';

import { type InstallAction } from './types';
import { installAction as incrementAction } from './actions/increment';
import { installAction as generateChangeAction } from './actions/change';

const main = () => {
  const program = new Command();
  const actions: InstallAction[] = [incrementAction, generateChangeAction];

  program
    .name('rush-x')
    .description('Rush monorepo integration action toolkit')
    .version('1.0.0')
    .showSuggestionAfterError(true)
    .showHelpAfterError(true);

  actions.forEach(a => {
    a(program);
  });

  program.parse();
};

main();
