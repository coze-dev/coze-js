export enum LocalStorageKey {
  ACCESS_TOKEN = 'access_token',
  REFRESH_TOKEN = 'refresh_token',
  WORKSPACE_ID = 'workspace_id',
  WORKSPACE_ACCESS_TOKEN = '_workspace_access_token',
  BOT_ID = 'bot_id',
  VOICE_ID = 'voice_id',
  WORKSPACE_PREFIX = '_workspace_',
  NOISE_SUPPRESSION = 'noise_suppression',
  VIDEO_STATE = 'video_state',
  PKCE_CODE_VERIFIER = 'pkce_code_verifier',
  TOKEN_EXPIRES_AT = 'token_expires_at',
}

export class LocalManager {
  private prefix: string;

  constructor(prefix = '') {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  get(key: string): string {
    return localStorage.getItem(this.getKey(key)) ?? '';
  }

  set(key: string, value: string): void {
    localStorage.setItem(this.getKey(key), value);
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  removeAll(prefix?: string): void {
    if (prefix) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix + prefix)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      localStorage.clear();
    }
  }
}
