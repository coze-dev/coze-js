import { describe, expect, test } from 'vitest';

import { Logger, logger } from '../../../src/libs/utils/logger';

describe('utils/logger', () => {
  test('logger', () => {
    logger.setLoglevel('release');
    logger.error('Logger Error Teset');
    logger.debug('Logger Debug Test');
    logger.info('Logger Info Test');
    logger.warn('Logger Warn Test');
    logger.seDebug();
    expect(logger.isDebug()).toBe(true);
  });

  test('Logger', () => {
    const logger2 = new Logger('Test', 'debug');
    logger2.debug('test');
    expect(logger2.isDebug()).toBe(true);
  });
});
