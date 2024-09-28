import { type CozeAPI } from '../../index.js';
import { Auth } from './auth.js';
import { type OAuthTokenOptions } from './index.js';

export class OAuthTokenAuth extends Auth {
  config: OAuthTokenOptions;

  constructor(client: CozeAPI) {
    super(client);
    if (client.authConfig.type !== 'oauth_token') {
      throw new Error('Invalid auth type');
    }
    this.config = client.authConfig;
  }

  // 获取重定向地址
  // https://www.coze.cn/api/permission/oauth2/authorize?response_type=code&client_id=8173420653665306615182245269****.app.coze&redirect_uri=https://www.coze.cn/open/oauth/apps&state=1294848'
  getRedirectUrl(): string {
    const baseUrl = this._client.baseURL.replace('https://api', 'https://www');
    return `${baseUrl}/api/permission/oauth2/authorize?response_type=code&client_id=${this.config.clientId}&redirect_uri=${this.config.redirectUrl}&state=${this.config.state}`;
  }

  async authorize() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (!code) {
      throw new Error('code is required');
    }

    const result = await this._client.api.getOAuthToken({
      grant_type: 'authorization_code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUrl,
      code,
    });

    console.log('1111', result);
  }
}
