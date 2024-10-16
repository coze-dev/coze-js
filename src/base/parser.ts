/* eslint-disable no-magic-numbers -- ignore */
/* eslint-disable @typescript-eslint/no-magic-numbers -- ignore */
import { JSONParseError } from './error';

export class PartialJSONParser {
  private numberChars = '0123456789.-+e';
  private str = '';

  parse(str: string) {
    this.str = str;
    if (str.length) {
      try {
        return JSON.parse(str);
      } catch (_) {
        return this.parseAny();
      }
    } else {
      return {};
    }
  }

  safeParse(str: string) {
    try {
      return this.parse(str);
    } catch (_) {
      return {};
    }
  }

  private parseAny() {
    if (!this.str) {
      throw new JSONParseError({ message: 'str is empty' });
    }
    const char = this.str[0];
    if (/\s\r\n\t/.test(char)) {
      return this.parseSpace();
    } else if (char === '[') {
      return this.parseArray();
    } else if (char === '{') {
      return this.parseObject();
    } else if (char === '"') {
      return this.parseString();
    } else if (char === 't') {
      return this.parseTrue();
    } else if (char === 'f') {
      return this.parseFalse();
    } else if (char === 'n') {
      return this.parseNull();
    } else if (this.numberChars.includes(char)) {
      return this.parseNumber();
    }
    throw new JSONParseError({ message: 'parse any failed' });
  }

  private parseSpace() {
    this.str.trim();
    return this.parseAny();
  }

  private parseArray() {
    // skip starting '['
    this.str = this.str.slice(1);
    this.str = this.str.trim();
    const acc: unknown[] = [];
    while (this.str) {
      if (this.str[0] === ']') {
        // skip ending ']'
        this.str = this.str.slice(1);
        break;
      }
      const res = this.parseAny();
      acc.push(res);
      this.str = this.str.trim();
      if (this.str.startsWith(',')) {
        this.str = this.str.slice(1);
        this.str = this.str.trim();
      }
    }
    return acc;
  }

  private parseObject() {
    // skip starting '{'
    this.str = this.str.slice(1);
    this.str = this.str.trim();
    const acc: Record<string, unknown> = {};
    while (this.str) {
      if (this.str[0] === '}') {
        // skip ending '}'
        this.str = this.str.slice(1);
        break;
      }
      const key = this.parseAny();
      this.str = this.str.trim();
      if (!this.str || this.str[0] === '}') {
        acc[key] = null;
        break;
      }
      if (this.str[0] !== ':') {
        throw new JSONParseError({ message: 'parse object key failed' });
      }
      // skip ':'
      this.str = this.str.slice(1);
      this.str = this.str.trim();
      if (!this.str || ',}'.includes(this.str[0])) {
        acc[key] = null;
        if (this.str.startsWith(',')) {
          this.str = this.str.slice(1);
        }
        break;
      }

      const value = this.parseAny();
      acc[key] = value;
      this.str = this.str.trim();
      if (this.str.startsWith(',')) {
        this.str = this.str.slice(1);
        this.str = this.str.trim();
      }
    }
    return acc;
  }

  private parseString() {
    let end = this.str.indexOf('"', 1);
    // escaped quotes
    while (end !== -1 && this.str[end - 1] === '\\') {
      end = this.str.indexOf('"', end + 1);
    }
    if (end === -1) {
      // unescaped value
      const value = this.str.slice(1).replace(/\\"/g, '"').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\n/g, '\n');
      this.str = '';
      return value;
    }
    const value = this.str.slice(0, end + 1);
    this.str = this.str.slice(end + 1);
    // removing starting and ending quote
    return value.slice(1, -1).replace(/\\"/g, '"').replace(/\\t/g, '\t').replace(/\\r/g, '\r').replace(/\\n/g, '\n');
  }

  private parseNumber() {
    let i = 0;
    while (i < this.str.length && this.numberChars.includes(this.str[i])) {
      i++;
    }
    const numberString = this.str.slice(0, i);
    this.str = this.str.slice(i);
    if (!numberString || numberString === '-' || numberString === '.') {
      return numberString;
    }
    let number: number;
    try {
      if (numberString.endsWith('.')) {
        number = parseInt(numberString.slice(0, -1));
      } else if (/[\.eE]/.test(numberString)) {
        number = parseFloat(numberString);
      } else {
        number = parseInt(numberString);
      }
    } catch (err) {
      return new JSONParseError({ message: 'parse number failed', cause: err });
    }
    return number;
  }

  private parseTrue() {
    if (this.str.startsWith('t') || this.str.startsWith('T')) {
      this.str = this.str.slice(4);
      return true;
    }
    throw new JSONParseError({ message: 'parse true failed' });
  }

  private parseFalse() {
    if (this.str.startsWith('f') || this.str.startsWith('F')) {
      this.str = this.str.slice(5);
      return false;
    }
    throw new JSONParseError({ message: 'parse false failed' });
  }

  private parseNull() {
    if (this.str.startsWith('n')) {
      this.str = this.str.slice(4);
      return null;
    }
    throw new JSONParseError({ message: 'parse null failed' });
  }
}
