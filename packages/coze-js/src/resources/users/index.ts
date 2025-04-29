import { APIResource } from '../resource';
import { type RequestOptions } from '../../core';

/**
 * User model representing a user's information
 */
export interface User {
  /**
   * The unique identifier of the user
   */
  user_id: string;

  /**
   * The username of the user
   */
  user_name: string;

  /**
   * The nickname of the user
   */
  nick_name: string;

  /**
   * The URL of the user's avatar
   */
  avatar_url: string;
}

/**
 * Users client for interacting with user-related APIs
 */
export class Users extends APIResource {
  /**
   * Get information about the authenticated user.
   * @param options - Optional request configuration options.
   * @returns Information about the authenticated user.
   */
  async me(options?: RequestOptions): Promise<User> {
    const apiUrl = '/v1/users/me';
    const result = await this._client.get<undefined, { data: User }>(
      apiUrl,
      undefined,
      false,
      options,
    );
    return result.data;
  }
}
