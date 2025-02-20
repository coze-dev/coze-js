export interface AuthConf {
  token: string;
  connectorId?: string;
  onRefreshToken: (oldToken?: string) => string | Promise<string>;
}
