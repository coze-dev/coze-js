import crypto from 'crypto';

/**
 * 生成指定长度的随机字符串(使用 crypto 模块)
 * @param digit 字符串长度
 * @returns 随机字符串
 */
export function randomHash(digit: number): string {
  return crypto
    .randomBytes(Math.ceil(digit / 2))
    .toString('hex')
    .slice(0, digit);
}
