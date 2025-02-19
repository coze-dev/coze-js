export enum Language {
  EN = "en",
  ZH_CN = "zh-CN",
}

export interface II18n {
  readonly language;
  t(
    key: string,
    _options?: Record<string, unknown>,
    _fallbackText?: string
  ): string;
}
