/* eslint-disable @typescript-eslint/no-namespace */
import { APIResource } from '../resource.js';

export class Bots extends APIResource {
  async create(params: CreateBotReq): Promise<CreateBotData> {
    const apiUrl = '/v1/bot/create';
    const result = await this._client.post<CreateBotReq, { data: CreateBotData }>(apiUrl, params);
    return result.data;
  }
  async update(params: UpdateBotReq): Promise<undefined> {
    const apiUrl = '/v1/bot/update';
    const result = await this._client.post<UpdateBotReq, { data: undefined }>(apiUrl, params);
    return result.data;
  }
  async list(params: ListBotReq): Promise<ListBotData> {
    const apiUrl = '/v1/space/published_bots_list';
    const result = await this._client.get<ListBotReq, { data: ListBotData }>(apiUrl, params);
    return result.data;
  }
  async publish(params: PublishBotReq): Promise<undefined> {
    const apiUrl = '/v1/bot/publish';
    const result = await this._client.post<PublishBotReq, { data: undefined }>(apiUrl, params);
    return result.data;
  }

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
  knowledge: KnowledgeInfo;
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
