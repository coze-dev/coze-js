/* eslint-disable @typescript-eslint/no-namespace */
import { APIResource } from '../resource';
import { type RequestOptions } from '../../core';

export class Bots extends APIResource {
  /**
   * Create a new agent. | 调用接口创建一个新的智能体。
   * @docs en:https://www.coze.com/docs/developer_guides/create_bot?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/create_bot?_lang=zh
   * @param params - Required The parameters for creating a bot. | 创建 Bot 的参数。
   * @param params.space_id - Required The Space ID of the space where the agent is located. | Bot 所在的空间的 Space ID。
   * @param params.name - Required The name of the agent. It should be 1 to 20 characters long. | Bot 的名称。
   * @param params.description - Optional The description of the agent. It can be 0 to 500 characters long. | Bot 的描述信息。
   * @param params.icon_file_id - Optional The file ID for the agent's avatar. | 作为智能体头像的文件 ID。
   * @param params.prompt_info - Optional The personality and reply logic of the agent. | Bot 的提示词配置。
   * @param params.onboarding_info - Optional The settings related to the agent's opening remarks. | Bot 的开场白配置。
   * @returns Information about the created bot. | 创建的 Bot 信息。
   */
  async create(
    params: CreateBotReq,
    options?: RequestOptions,
  ): Promise<CreateBotData> {
    const apiUrl = '/v1/bot/create';
    const result = await this._client.post<
      CreateBotReq,
      { data: CreateBotData }
    >(apiUrl, params, false, options);
    return result.data;
  }

  /**
   * Update the configuration of an agent. | 调用接口修改智能体的配置。
   * @docs en:https://www.coze.com/docs/developer_guides/update_bot?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/update_bot?_lang=zh
   * @param params - Required The parameters for updating a bot. | 修改 Bot 的参数。
   * @param params.bot_id - Required The ID of the agent that the API interacts with. | 待修改配置的智能体ID。
   * @param params.name - Optional The name of the agent. | Bot 的名称。
   * @param params.description - Optional The description of the agent. | Bot 的描述信息。
   * @param params.icon_file_id - Optional The file ID for the agent's avatar. | 作为智能体头像的文件 ID。
   * @param params.prompt_info - Optional The personality and reply logic of the agent. | Bot 的提示词配置。
   * @param params.onboarding_info - Optional The settings related to the agent's opening remarks. | Bot 的开场白配置。
   * @param params.knowledge - Optional Knowledge configurations of the agent. | Bot 的知识库配置。
   * @returns Undefined | 无返回值
   */
  async update(
    params: UpdateBotReq,
    options?: RequestOptions,
  ): Promise<undefined> {
    const apiUrl = '/v1/bot/update';
    const result = await this._client.post<UpdateBotReq, { data: undefined }>(
      apiUrl,
      params,
      false,
      options,
    );
    return result.data;
  }

  /**
   * Get the agents published as API service. | 调用接口查看指定空间发布到 Agent as API 渠道的智能体列表。
   * @docs en:https://www.coze.com/docs/developer_guides/published_bots_list?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/published_bots_list?_lang=zh
   * @param params - Required The parameters for listing bots. | 列出 Bot 的参数。
   * @param params.space_id - Required The ID of the space. | Bot 所在的空间的 Space ID。
   * @param params.page_size - Optional Pagination size. | 分页大小。
   * @param params.page_index - Optional Page number for paginated queries. | 分页查询时的页码。
   * @returns List of published bots. | 已发布的 Bot 列表。
   */
  async list(
    params: ListBotReq,
    options?: RequestOptions,
  ): Promise<ListBotData> {
    const apiUrl = '/v1/space/published_bots_list';
    const result = await this._client.get<ListBotReq, { data: ListBotData }>(
      apiUrl,
      params,
      false,
      options,
    );
    return result.data;
  }

  /**
   * Publish the specified agent as an API service. | 调用接口创建一个新的智能体。
   * @docs en:https://www.coze.com/docs/developer_guides/publish_bot?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/publish_bot?_lang=zh
   * @param params - Required The parameters for publishing a bot. | 发布 Bot 的参数。
   * @param params.bot_id - Required The ID of the agent that the API interacts with. | 要发布的智能体ID。
   * @param params.connector_ids - Required The list of publishing channel IDs for the agent. | 智能体的发布渠道 ID 列表。
   * @returns Undefined | 无返回值
   */
  async publish(
    params: PublishBotReq,
    options?: RequestOptions,
  ): Promise<undefined> {
    const apiUrl = '/v1/bot/publish';
    const result = await this._client.post<PublishBotReq, { data: undefined }>(
      apiUrl,
      params,
      false,
      options,
    );
    return result.data;
  }

  /**
   * Get the configuration information of the agent. | 获取指定智能体的配置信息。
   * @docs en:https://www.coze.com/docs/developer_guides/get_metadata?_lang=en
   * @docs zh:https://www.coze.cn/docs/developer_guides/get_metadata?_lang=zh
   * @param params - Required The parameters for retrieving a bot. | 获取 Bot 的参数。
   * @param params.bot_id - Required The ID of the agent that the API interacts with. | 要查看的智能体ID。
   * @returns Information about the bot. | Bot 的配置信息。
   */
  async retrieve(
    params: RetrieveBotReq,
    options?: RequestOptions,
  ): Promise<BotInfo> {
    const apiUrl = '/v1/bot/get_online_info';
    const result = await this._client.get<RetrieveBotReq, { data: BotInfo }>(
      apiUrl,
      params,
      false,
      options,
    );
    return result.data;
  }
}

export interface CreateBotReq {
  space_id: string;
  /**
   * The name of the Bot.
   */
  name: string;

  /**
   * The description of the Bot.
   */
  description?: string;

  /**
   * The avatar url of the Bot.
   */
  icon_file_id?: string;

  /**
   * The prompt configuration of the Bot, refer to the Prompt object for details.
   */
  prompt_info?: {
    /**
     * The prompt configured for the Bot.
     */
    prompt: string;
  };

  /**
   * The onboarding configuration of the Bot, refer to the Onboarding object for details.
   */
  onboarding_info?: {
    /**
     * The prologue content configured for the Bot.
     */
    prologue: string;

    /**
     * The list of recommended questions configured for the Bot. This field is not returned if the user question suggestion feature is not enabled.
     */
    suggested_questions?: string[];
  };
}

export interface UpdateBotReq {
  bot_id: string;
  name: string;
  description?: string;
  icon_file_id?: string;
  prompt_info?: {
    prompt?: string;
  };
  onboarding_info?: {
    prologue?: string;
    suggested_questions?: string[];
  };
  knowledge?: KnowledgeInfo;
}

export interface PublishBotReq {
  bot_id: string;
  connector_ids: string[];
}

export interface ListBotReq {
  space_id: string;
  page_size?: number;
  page_index?: number;
}

export interface ListBotData {
  total: number;
  space_bots: SimpleBot[];
}

export interface RetrieveBotReq {
  bot_id: string;
}

export interface CreateBotData {
  bot_id: string;
}

export interface BotInfo {
  /**
   * The unique identifier of the Bot.
   */
  bot_id: string;

  /**
   * The name of the Bot.
   */
  name: string;

  /**
   * The description of the Bot.
   */
  description: string;

  /**
   * The avatar url of the Bot.
   */
  icon_url: string;

  /**
   * The creation time, formatted as a 10-digit Unix timestamp, in seconds.
   */
  create_time: number;

  /**
   * The update time, formatted as a 10-digit Unix timestamp, in seconds.
   */
  update_time: number;

  /**
   * The latest version number of the Bot.
   */
  version: string;

  /**
   * The prompt configuration of the Bot, refer to the Prompt object for details.
   */
  prompt_info: {
    /**
     * The prompt configured for the Bot.
     */
    prompt: string;
  };

  /**
   * The onboarding configuration of the Bot, refer to the Onboarding object for details.
   */
  onboarding_info: {
    /**
     * The prologue content configured for the Bot.
     */
    prologue: string;

    /**
     * The list of recommended questions configured for the Bot. This field is not returned if the user question suggestion feature is not enabled.
     */
    suggested_questions?: string[];
  };

  /**
   * - 0: Single Agent mode
   * - 1: Multi Agent mode
   */
  bot_mode: Bots.BotModeType;

  /**
   * The plugins configured for the Bot, refer to the Plugin object for details.
   */
  plugin_info_list: BotPlugin[];

  /**
   * The model configured for the Bot, refer to the Model object for details.
   */
  model_info: {
    /**
     * The unique identifier of the model.
     */
    model_id: string;

    /**
     * The name of the model.
     */
    model_name: string;
  };
}

export interface BotPlugin {
  /**
   * The unique identifier of the plugin.
   */
  plugin_id: string;

  /**
   * The name of the plugin.
   */
  name: string;

  /**
   * The description of the plugin.
   */
  description: string;

  /**
   * The avatar of the plugin.
   */
  icon_url: string;

  /**
   * The list of tools for the plugin.
   */
  api_info_list: {
    /**
     * The unique identifier of the tool.
     */
    api_id: string;

    /**
     * The name of the tool.
     */
    name: string;

    /**
     * The description of the tool.
     */
    description: string;
  }[];
}

export interface SimpleBot {
  /**
   * The unique identifier of the Bot.
   */
  bot_id: string;

  /**
   * The name of the Bot.
   */
  bot_name: string;

  /**
   * The description of the Bot.
   */
  description: string;

  /**
   * The avatar url of the Bot.
   */
  icon_url: string;

  /**
   * The time of the last publication of the Bot, formatted as a 10-digit Unix timestamp. The Bot list returned by this API is sorted in descending order by this field.
   */
  publish_time: string;
}

export interface KnowledgeInfo {
  dataset_ids?: string[];

  auto_call?: boolean;

  search_strategy?: number;
}

export namespace Bots {
  /**
   * Bot mode, the value is:
   * - 0: Single Agent mode
   * - 1: Multi Agent mode
   */
  export type BotModeType = 0 | 1;
}
