import { logger as log } from '@coze-infra/rush-logger';

import { isCI } from './env';
import { addMessage as addMessageInCI, CIMessageLevel } from './ci-interactor';

interface Logger {
  info: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
}

const loggerForCI: Logger = {
  info: addMessageInCI.bind(null, CIMessageLevel.INFO),
  error: addMessageInCI.bind(null, CIMessageLevel.ERROR),
  warning: addMessageInCI.bind(null, CIMessageLevel.WARNING),
};

const loggerForShell: Logger = {
  info: log.info.bind(log),
  error: log.error.bind(log),
  warning: log.warning.bind(log),
};

export const logger = isCI() ? loggerForCI : loggerForShell;
