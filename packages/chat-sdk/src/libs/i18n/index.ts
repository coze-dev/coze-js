import { II18n, Language } from "@/libs/types";

import { resource } from "./resource";

export class I18n implements II18n {
  readonly language;
  constructor(language: string) {
    this.language = language;
  }
  t(
    key: string,
    _options?: Record<string, unknown>,
    _fallbackText?: string
  ): string {
    const i18nKey = resource[this.language] || resource[Language.EN];
    if (i18nKey.simple[key]) {
      return i18nKey.simple[key];
    } else if (i18nKey.special[key]) {
      return i18nKey.special[key](_options);
    } else {
      return _fallbackText || "";
    }
  }
}
