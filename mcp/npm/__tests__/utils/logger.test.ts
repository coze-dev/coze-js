import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  logger,
  LogLevel,
  setLogLevel,
  getLogLevel,
} from '../../src/utils/logger';

describe('logger 模块测试', () => {
  let consoleLogSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    // 测试后恢复默认日志级别
    setLogLevel(LogLevel.INFO);
  });

  it('设置和获取日志级别正常工作', () => {
    setLogLevel(LogLevel.DEBUG);
    expect(getLogLevel()).toBe(LogLevel.DEBUG);

    setLogLevel(LogLevel.ERROR);
    expect(getLogLevel()).toBe(LogLevel.ERROR);

    setLogLevel(LogLevel.NONE);
    expect(getLogLevel()).toBe(LogLevel.NONE);
  });

  it('在 DEBUG 级别时所有日志都应该输出', () => {
    setLogLevel(LogLevel.DEBUG);

    logger.debug('测试调试信息');
    logger.info('测试信息');
    logger.warn('测试警告');
    logger.error('测试错误');
    logger.success('测试成功');

    expect(consoleLogSpy).toHaveBeenCalledTimes(5);
  });

  it('在 INFO 级别时不应该输出 DEBUG 日志', () => {
    setLogLevel(LogLevel.INFO);

    logger.debug('测试调试信息');
    logger.info('测试信息');
    logger.warn('测试警告');
    logger.error('测试错误');
    logger.success('测试成功');

    expect(consoleLogSpy).toHaveBeenCalledTimes(4);
    // 验证第一次调用不是debug日志
    expect(consoleLogSpy.mock.calls[0][0]).not.toContain('[DEBUG]');
  });

  it('在 ERROR 级别时只应该输出 ERROR 和 SUCCESS 日志', () => {
    setLogLevel(LogLevel.ERROR);

    logger.debug('测试调试信息');
    logger.info('测试信息');
    logger.warn('测试警告');
    logger.error('测试错误');
    logger.success('测试成功');

    expect(consoleLogSpy).toHaveBeenCalledTimes(2);
    // 验证调用包含ERROR日志
    expect(consoleLogSpy.mock.calls[0][0]).toContain('[ERROR]');
    // 验证调用包含SUCCESS日志
    expect(consoleLogSpy.mock.calls[1][0]).toContain('[SUCCESS]');
  });

  it('在 NONE 级别时不应该输出任何日志', () => {
    setLogLevel(LogLevel.NONE);

    logger.debug('测试调试信息');
    logger.info('测试信息');
    logger.warn('测试警告');
    logger.error('测试错误');
    logger.success('测试成功');

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it('能够正确处理不显示前缀的选项', () => {
    setLogLevel(LogLevel.INFO);

    logger.info('测试信息', false);

    expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    // 检查没有前缀
    expect(consoleLogSpy.mock.calls[0][0]).not.toContain('[INFO]');
    expect(consoleLogSpy.mock.calls[0][0]).toBe('测试信息');
  });
});
