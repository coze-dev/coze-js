import { APIResource } from '../resource';
import { type RequestOptions } from '../../core';

export class Variables extends APIResource {
  /**
   * Set values for user variables
   * @docs en: https://www.coze.com/open/docs/developer_guides/update_variable
   * @docs zh: https://www.coze.cn/open/docs/developer_guides/update_variable
   * @param params - The parameters for the variable update
   * @param options - Optional request options
   */
  async update(
    params: VariableUpdateReq,
    options?: RequestOptions,
  ): Promise<void> {
    const apiUrl = '/v1/variables';
    await this._client.put<VariableUpdateReq, { data: undefined }>(
      apiUrl,
      params,
      false,
      options,
    );
  }

  /**
   * Get the values of user variables
   * @docs en: https://www.coze.com/open/docs/developer_guides/read_variable
   * @docs zh: https://www.coze.cn/open/docs/developer_guides/read_variable
   * @param params - The parameters for the variable retrieval
   * @param options - Optional request options
   */
  async retrieve(
    params: VariableRetrieveReq,
    options?: RequestOptions,
  ): Promise<VariableData> {
    const apiUrl = '/v1/variables';
    const response = await this._client.get<
      VariableRetrieveReq,
      { data: VariableData }
    >(apiUrl, params, false, options);
    return response.data;
  }
}

export interface VariableUpdateReq {
  /**
   * Application ID
   * Required when retrieving user variables set in an application
   * Can be found in the URL of the application's workflow page, after the "project-ide" parameter
   * Either app_id or bot_id must be provided, otherwise an error will be returned
   */
  app_id?: string;

  /**
   * Bot ID
   * Required when retrieving user variables set in a bot
   * Can be found in the URL of the bot's development page, after the "bot" parameter
   * Either app_id or bot_id must be provided, otherwise an error will be returned
   */
  bot_id?: string;

  /**
   * Channel ID for the bot or application
   * Supported channels include:
   * - API: 1024
   * - ChatSDK: 999
   * - Custom channels: custom channel ID
   * When using a custom channel, the access token of the channel creator must be used
   */
  connector_id?: string;

  /**
   * User ID for retrieving specific user's variable values
   * Corresponds to the user_id in the ext field of the workflow execution API
   */
  connector_uid?: string;
  /**
   * Array of user variables, cannot be empty
   */
  data: Omit<KVItem, 'create_time' | 'update_time'>[];
}

export interface VariableRetrieveReq {
  /**
   * Application ID
   * Required when retrieving user variables set in an application
   * Can be found in the URL of the application's workflow page, after the "project-ide" parameter
   * Either app_id or bot_id must be provided, otherwise an error will be returned
   */
  app_id?: string;

  /**
   * Bot ID
   * Required when retrieving user variables set in a bot
   * Can be found in the URL of the bot's development page, after the "bot" parameter
   * Either app_id or bot_id must be provided, otherwise an error will be returned
   */
  bot_id?: string;

  /**
   * Channel ID for the bot or application
   * Supported channels include:
   * - API: 1024
   * - ChatSDK: 999
   * - Custom channels: custom channel ID
   * When using a custom channel, the access token of the channel creator must be used
   */
  connector_id?: string;

  /**
   * User ID for retrieving specific user's variable values
   * Corresponds to the user_id in the ext field of the workflow execution API
   */
  connector_uid?: string;

  /**
   * List of variable names, multiple variables separated by commas
   * If empty, returns all user variables for the bot or application
   * If a specified variable doesn't exist, it won't be included in the response
   */
  keywords?: string[];
}

/**
 * Response data for variable retrieval
 */
export interface VariableData {
  items: KVItem[];
}

/**
 * Variable data structure with key-value pair and metadata
 */
export interface KVItem {
  /**
   * The name of the user variable
   * Must be an already created and enabled user variable in the bot or application
   * Cannot be set as a system variable
   */
  keyword: string;

  /**
   * The value of the user variable
   */
  value: string;

  /**
   * The time when the variable value was first set
   * If the variable value is the default value, create_time will be 0
   * Unix timestamp format in seconds
   */
  create_time: number;

  /**
   * The time when the variable value was last updated
   * Unix timestamp format in seconds
   */
  update_time: number;
}

/**
 * Alias for VariableData to fix type errors
 */
export type VariableCreateData = VariableData;
