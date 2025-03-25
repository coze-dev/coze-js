import { Command } from 'commander';

import { installAction as generateChangeAction } from './action';

const main = () => {
  const program = new Command();
  const actions: InstallAction[] = [
    incrementAction,
    generateChangeAction,
    publishAction,
    releaseAction,
    createFixCommand,
  ];

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
