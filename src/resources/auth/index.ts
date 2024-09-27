export abstract class Auth {
  abstract tokenType: string;

  abstract getToken(): string;

  protected authentication(headers: Headers) {
    headers.set('Authorization', `${this.tokenType} ${this.getToken()}`);
  }
}

export class TokenAuth extends Auth {
  tokenType = 'Bearer';
  token: string;

  constructor(token: string) {
    super();
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }
}
