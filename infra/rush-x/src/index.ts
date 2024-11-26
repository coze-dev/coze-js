import { CommandLineParser } from '@rushstack/ts-command-line';
import { RushConfiguration } from '@rushstack/rush-sdk/lib/api/RushConfiguration';
import { logger } from '@coze-infra/rush-logger';

import { IncrementAction } from './actions';

const a = 'a';

export class RushCICommandLine extends CommandLineParser {
  readonly rushConfiguration!: RushConfiguration;

  constructor() {
    super({
      toolFilename: 'rush-x',
      enableTabCompletionAction: true,
      toolDescription: 'Rush monorepo integration action toolkit',
    });

    try {
      const rushJsonFilename: string | undefined =
        RushConfiguration.tryFindRushJsonLocation({
          startingFolder: process.cwd(),
        });

      if (!rushJsonFilename) {
        throw new Error('Find rush.json fail');
      }
      this.rushConfiguration =
        RushConfiguration.loadFromConfigurationFile(rushJsonFilename);
    } catch (error) {
      logger.error(error as string);
    }

    this.addAction(new IncrementAction(this));
  }
}
