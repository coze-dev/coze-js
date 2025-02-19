import type { LogLevel } from "@/libs/types";
export class Logger {
  private prefix: string;
  private level: LogLevel;
  constructor(prefix: string = "", level: LogLevel = "release") {
    this.prefix = prefix;
    this.level = level;
  }
  setLoglevel(level?: LogLevel) {
    if (!level) {
      return;
    }
    this.level = level;
  }
  seDebug() {
    this.level = "debug";
  }
  isDebug() {
    return this.level === "debug";
  }
  debug(...args) {
    if (this.level !== "debug") {
      return;
    }
    console.log(this.prefix, "[debug]", ...args, "\n");
  }
  info(...args) {
    console.info(this.prefix, "[info]", ...args, "\n");
  }
  warn(...args) {
    console.warn(this.prefix, "[warn]", ...args, "\n");
  }
  error(...args) {
    console.error(this.prefix, "[error]", ...args, "\n");
  }
}
export const logger = new Logger("[coze-mini-sdk]");
