import { type CozeAPI } from '../../index.js';
import { OAuthTokenAuth } from './oauth_token.js';
import { PatTokenAuth } from './pat_token.js';

export type AuthType = 'pat_token' | 'oauth_token' | 'oauth_pkce' | 'jwt_token' | 'device_token';
export type PatTokenOptions = {
  type: 'pat_token';
  token: string;
};
export type OAuthTokenOptions = {
  type: 'oauth_token';
  redirectUrl: string;
  clientId: string;
  state: string;
};
export type OAuthPKCEOptions = {
  type: 'oauth_pkce';
  redirectUrl: string;
  clientId: string;
  state: string;
};
export type JWTTokenOptions = {
  type: 'jwt_token';
  token: string;
};
export type DeviceTokenOptions = {
  type: 'device_token';
  token: string;
};
export type AuthOptions = PatTokenOptions | OAuthTokenOptions | OAuthPKCEOptions | JWTTokenOptions | DeviceTokenOptions;

export const getAuthInstance = (client: CozeAPI) => {
  const config = client.authConfig;
  switch (config.type) {
    case 'pat_token':
      return new PatTokenAuth(client);
    case 'oauth_token':
      return new OAuthTokenAuth(client);
    default:
      throw new Error('Invalid auth type');
  }
};

export { Auth } from './auth.js';
