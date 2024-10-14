/* eslint-disable @typescript-eslint/no-namespace */
import { APIResource } from '../resource.js';

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
  async create(params: CreateBotReq): Promise<CreateBotData> {
    const apiUrl = '/v1/bot/create';
    const result = await this._client.post<CreateBotReq, { data: CreateBotData }>(apiUrl, params);
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
  async update(params: UpdateBotReq): Promise<undefined> {
    const apiUrl = '/v1/bot/update';
    const result = await this._client.post<UpdateBotReq, { data: undefined }>(apiUrl, params);
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
  async list(params: ListBotReq): Promise<ListBotData> {
    const apiUrl = '/v1/space/published_bots_list';
    const result = await this._client.get<ListBotReq, { data: ListBotData }>(apiUrl, params);
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
  async publish(params: PublishBotReq): Promise<undefined> {
    const apiUrl = '/v1/bot/publish';
    const result = await this._client.post<PublishBotReq, { data: undefined }>(apiUrl, params);
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
  async retrieve(params: RetrieveBotReq): Promise<BotInfo> {
    const apiUrl = '/v1/bot/get_online_info';
    const result = await this._client.get<RetrieveBotReq, { data: BotInfo }>(apiUrl, params);
    return result.data;
  }
}

export interface CreateBotReq {
  space_id: string;
  /**
   * Bot 的名称。
   */
  name: string;

  /**
   * Bot 的描述信息。
   */
  description?: string;

  /**
   * Bot 的头像地址。
   */
  icon_file_id?: string;

  /**
   * Bot 的提示词配置，参考 Prompt object 说明。
   */
  prompt_info?: {
    /**
     * Bot 配置的提示词。
     */
    prompt: string;
  };

  /**
   * Bot 的开场白配置，参考 Onboarding object 说明。
   */
  onboarding_info?: {
    /**
     * Bot 配置的开场白内容。
     */
    prologue: string;

    /**
     * Bot 配置的推荐问题列表。未开启用户问题建议时，不返回此字段。
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
   * Bot 的唯一标识。
   */
  bot_id: string;

  /**
   * Bot 的名称。
   */
  name: string;

  /**
   * Bot 的描述信息。
   */
  description: string;

  /**
   * Bot 的头像地址。
   */
  icon_url: string;

  /**
   * 创建时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
   */
  create_time: number;

  /**
   * 更新时间，格式为 10 位的 Unixtime 时间戳，单位为秒（s）。
   */
  update_time: number;

  /**
   * Bot 最新版本的版本号。
   */
  version: string;

  /**
   * Bot 的提示词配置，参考 Prompt object 说明。
   */
  prompt_info: {
    /**
     * Bot 配置的提示词。
     */
    prompt: string;
  };

  /**
   * Bot 的开场白配置，参考 Onboarding object 说明。
   */
  onboarding_info: {
    /**
     * Bot 配置的开场白内容。
     */
    prologue: string;

    /**
     * Bot 配置的推荐问题列表。未开启用户问题建议时，不返回此字段。
     */
    suggested_questions?: string[];
  };

  /**
   * Bot 模式，取值：
   * - 0：单 Agent 模式
   * - 1：多 Agent 模式
   */
  bot_mode: Bots.BotModeType;

  /**
   * Bot 配置的插件，参考 Plugin object 说明。
   */
  plugin_info_list: BotPlugin[];

  /**
   * Bot 配置的模型，参考 Model object 说明。
   */
  model_info: {
    /**
     * 模型的唯一标识。
     */
    model_id: string;

    /**
     * 模型名称。
     */
    model_name: string;
  };
}

export interface BotPlugin {
  /**
   * 插件唯一标识。
   */
  plugin_id: string;

  /**
   * 插件名称。
   */
  name: string;

  /**
   * 插件描述。
   */
  description: string;

  /**
   * 插件头像。
   */
  icon_url: string;

  /**
   * 插件的工具列表信息
   */
  api_info_list: {
    /**
     * 工具的唯一标识。
     */
    api_id: string;

    /**
     * 工具的名称。
     */
    name: string;

    /**
     * 工具的描述。
     */
    description: string;
  }[];
}

export interface SimpleBot {
  /**
   * Bot 的唯一标识。
   */
  bot_id: string;

  /**
   * Bot 的名称。
   */
  bot_name: string;

  /**
   * Bot 的描述信息。
   */
  description: string;

  /**
   * Bot 的头像地址。
   */
  icon_url: string;

  /**
   * Bot 的最近一次发布时间，格式为 10 位的 Unixtime 时间戳。此 API 返回的 Bot 列表按照此字段降序排列。
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
   * Bot 模式，取值：
   * - 0：单 Agent 模式
   * - 1：多 Agent 模式
   */
  export type BotModeType = 0 | 1;
}
