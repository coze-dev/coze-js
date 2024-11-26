import { logger as log } from '@coze-infra/rush-logger';
import * as core from '@actions/core';

import { isCI } from './env';

interface Logger {
  info: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

const loggerForCI: Logger = {
  info: core.info,
  error: core.error,
  warning: core.warning,
};

const loggerForShell: Logger = {
  info: log.info.bind(log),
  error: log.error.bind(log),
  warning: log.warning.bind(log),
};

export const logger = isCI() ? loggerForCI : loggerForShell;
