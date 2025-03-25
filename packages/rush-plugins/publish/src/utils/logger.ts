/**
 * 日志工具
 *
 * 提供统一的日志输出接口，支持不同级别的日志，包括彩色输出
 */

// 日志级别枚举
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SUCCESS = 4,
  NONE = 5, // 用于完全禁用日志
}

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  debug: '\x1b[36m', // 青色
  info: '\x1b[34m', // 蓝色
  warn: '\x1b[33m', // 黄色
  error: '\x1b[31m', // 红色
  success: '\x1b[32m', // 绿色
};

// 默认日志级别
let currentLogLevel = LogLevel.INFO;

/**
 * 设置全局日志级别
 * @param level 日志级别
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

/**
 * 获取当前日志级别
 * @returns 当前日志级别
 */
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

/**
 * 基础日志函数
 * @param level 日志级别
 * @param message 日志消息
 * @param showPrefix 是否显示前缀，默认为 true
 */
function log(level: LogLevel, message: string, showPrefix = true): void {
  if (level < currentLogLevel) {
    return;
  }

  let prefix = '';
  let color = '';

  switch (level) {
    case LogLevel.DEBUG: {
      prefix = '[DEBUG]';
      color = colors.debug;
      break;
    }
    case LogLevel.WARN: {
      prefix = '[WARN]';
      color = colors.warn;
      break;
    }
    case LogLevel.ERROR: {
      prefix = '[ERROR]';
      color = colors.error;
      break;
    }
    case LogLevel.SUCCESS: {
      prefix = '[SUCCESS]';
      color = colors.success;
      break;
    }
    case LogLevel.INFO:
    default: {
      prefix = '[INFO]';
      color = colors.info;
      break;
    }
  }

  // 格式化日志前缀
  const formattedPrefix = showPrefix ? `${color}${prefix}${colors.reset} ` : '';

  // 输出日志
  console.log(`${formattedPrefix}${message}`);
}

/**
 * 导出的日志工具
 */
export const logger = {
  /**
   * 调试日志
   * @param message 日志消息
   * @param showPrefix 是否显示前缀，默认为 true
   */
  debug(message: string, showPrefix = true): void {
    log(LogLevel.DEBUG, message, showPrefix);
  },

  /**
   * 信息日志
   * @param message 日志消息
   * @param showPrefix 是否显示前缀，默认为 true
   */
  info(message: string, showPrefix = true): void {
    log(LogLevel.INFO, message, showPrefix);
  },

  /**
   * 警告日志
   * @param message 日志消息
   * @param showPrefix 是否显示前缀，默认为 true
   */
  warn(message: string, showPrefix = true): void {
    log(LogLevel.WARN, message, showPrefix);
  },

  /**
   * 错误日志
   * @param message 日志消息
   * @param showPrefix 是否显示前缀，默认为 true
   */
  error(message: string, showPrefix = true): void {
    log(LogLevel.ERROR, message, showPrefix);
  },

  /**
   * 成功日志
   * @param message 日志消息
   * @param showPrefix 是否显示前缀，默认为 true
   */
  success(message: string, showPrefix = true): void {
    log(LogLevel.SUCCESS, message, showPrefix);
  },
};
