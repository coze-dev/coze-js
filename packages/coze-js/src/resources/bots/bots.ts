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
   * @deprecated Use listNew instead.
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
   * Get bots list. | 查看智能体列表
   */
  async listNew(
    params: ListBotNewReq,
    options?: RequestOptions,
  ): Promise<ListBotNewData> {
    const apiUrl = '/v1/bots';
    const result = await this._client.get<
      ListBotNewReq,
      { data: ListBotNewData }
    >(apiUrl, params, false, options);
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
   * @deprecated Use retrieveNew instead.
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
  /**
   * Get the configuration information of the agent. | 获取指定智能体的配置信息。
   * @param botId - Required The ID of the agent that the API interacts with. | 要查看的智能体ID。
   * @param params
   * @param options
   * @returns
   */
  async retrieveNew(
    botId: string,
    params?: RetrieveBotNewReq,
    options?: RequestOptions,
  ): Promise<BotInfo> {
    const apiUrl = `/v1/bots/${botId}`;
    const result = await this._client.get<RetrieveBotNewReq, { data: BotInfo }>(
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
  plugin_id_list?: {
    id_list: PluginIdInfo[];
  };
  workflow_id_list?: {
    ids: WorkflowIdInfo[];
  };
  model_info_config?: ModelInfoConfig;
  suggest_reply_info?: SuggestReplyInfo;
}

export interface SuggestReplyInfo {
  reply_mode: SuggestReplyMode;
  customized_prompt?: string;
}

export enum SuggestReplyMode {
  /**
   * The bot does not suggest replies.
   */
  DISABLE = 'disable',
  /**
   * The bot suggests replies.
   */
  ENABLE = 'enable',
  /**
   * The bot suggests replies based on the customized prompt.
   */
  CUSTOMIZED = 'customized',
}

export interface UpdateBotReq {
  bot_id: string;
  name?: string;
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
  plugin_id_list?: {
    id_list: PluginIdInfo[];
  };
  workflow_id_list?: {
    ids: WorkflowIdInfo[];
  };
  model_info_config?: ModelInfoConfig;
  suggest_reply_info?: SuggestReplyInfo;
}

export interface PluginIdInfo {
  plugin_id: string;
  api_id?: string;
}

export interface WorkflowIdInfo {
  id: string;
}

export interface ModelInfoConfig {
  /**
   * The unique identifier of the model.
   */
  model_id: string;

  /**
   * Top K sampling.
   */
  top_k?: number;

  /**
   * Top P sampling (nucleus sampling).
   */
  top_p?: number;

  /**
   * Maximum number of tokens to generate.
   */
  max_tokens?: number;

  /**
   * Sampling temperature.
   */
  temperature?: number;

  /**
   * Number of context rounds to carry.
   */
  context_round?: number;

  /**
   * Output format.
   */
  response_format?: 'text' | 'markdown' | 'json';

  /**
   * Penalty for repeated topics.
   */
  presence_penalty?: number;

  /**
   * Penalty for repeated statements.
   */
  frequency_penalty?: number;
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

export interface ListBotNewReq {
  /**
   * 工作空间 ID。
   */
  workspace_id?: string;
  /**
   * all：所有状态。
   * published_online：（默认值）已发布的正式版。
   * published_draft：已发布但当前为草稿状态。
   * unpublished_draft：从未发布过。
   */
  publish_status?: string;
  /**
   * 渠道 ID，仅在 publish_status 为 published_online 或 published_draft 时需要设置。
   */
  connector_id?: string;
  /**
   * 分页大小。默认为 20，即每页返回 20 条数据。
   */
  page_size?: number;
  /**
   * 页码。默认为 1。
   */
  page_num?: number;
}

export interface ListBotNewData {
  total: number;
  items: ListBotInfo[];
}

export interface ListBotInfo {
  /**
   * The ID of the agent.
   */
  id: string;

  /**
   * The name of the agent.
   */
  name: string;

  /**
   * The URL of the agent's icon.
   */
  icon_url: string;

  /**
   * The last update time of the agent in Unix timestamp format (seconds).
   */
  updated_at: number;

  /**
   * The description of the agent.
   */
  description: string;

  /**
   * Whether the agent is published.
   * true indicates published.
   * false indicates unpublished.
   */
  is_published: boolean;

  /**
   * The last publish time of the agent in Unix timestamp format (seconds).
   * Only returned when the agent is published. If the agent is an unpublished draft version, this value will be empty.
   */
  published_at?: number;

  /**
   * The Coze user ID of the agent creator.
   */
  owner_user_id: string;
}

export interface ListBotData {
  total: number;
  space_bots: SimpleBot[];
}

export interface RetrieveBotReq {
  bot_id: string;
}

export interface RetrieveBotNewReq {
  /**
   * Whether the agent is published.
   * true indicates published.
   * false indicates unpublished.
   */
  is_published?: boolean;
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
  knowledge: CommonKnowledge;
  shortcut_commands: ShortcutCommandInfo[];
  workflow_info_list: WorkflowInfo[];
  suggest_reply_info: SuggestReplyInfo;
  background_image_info: BotBackgroundImageInfo;
  variables: BotVariable[];
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

export interface CommonKnowledge {
  knowledge_infos: {
    id: string;
    name: string;
  }[];
}

export interface ShortcutCommandInfo {
  /**
   * The unique identifier of the shortcut command.
   */
  id: string;

  /**
   * The button name of the shortcut command.
   */
  name: string;

  /**
   * The tool information used by the shortcut command.
   */
  tool: ShortcutCommandToolInfo;

  /**
   * The command name of the shortcut command.
   */
  command: string;

  /**
   * For multi-agent bots, this returns the node ID specified by the shortcut command.
   */
  agent_id?: string;

  /**
   * The icon URL of the shortcut command.
   */
  icon_url: string;

  /**
   * The components list of the shortcut command.
   */
  components: ShortcutCommandComponent[];

  /**
   * The description of the shortcut command.
   */
  description: string;

  /**
   * The command content of the shortcut command.
   */
  query_template: string;
}

export interface ShortcutCommandToolInfo {
  /**
   * The name of the tool.
   */
  name: string;

  /**
   * The type of the tool.
   */
  type: 'plugin' | 'workflow';
}

export interface ShortcutCommandComponent {
  /**
   * The name of the component.
   */
  name: string;

  /**
   * The description of the component.
   */
  description: string;

  /**
   * The type of the component.
   */
  type: 'text' | 'select' | 'file';

  /**
   * The tool parameter name.
   */
  tool_parameter: string;

  /**
   * The default value of the component.
   */
  default_value: string;

  /**
   * Whether the component is hidden.
   */
  is_hide: boolean;

  /**
   * The options of the component.
   */
  options?: string[];
}

export interface WorkflowInfo {
  id: string;
  name: string;
  icon_url: string;
  description: string;
}

export namespace Bots {
  /**
   * Bot mode, the value is:
   * - 0: Single Agent mode
   * - 1: Multi Agent mode
     - 2：Single Agent workflow
   */
  export type BotModeType = 0 | 1 | 2;
}

export interface GradientPosition {
  left?: number;
  right?: number;
}

export interface CanvasPosition {
  width?: number;
  height?: number;
  left?: number;
  top?: number;
}

export interface BackgroundImageInfo {
  image_url: string;
  theme_color?: string;
  gradient_position?: GradientPosition;
  canvas_position?: CanvasPosition;
}

export interface BotBackgroundImageInfo {
  web_background_image?: BackgroundImageInfo;
  mobile_background_image?: BackgroundImageInfo;
}

export enum VariableType {
  /**
   * The variable is a key-value pair.
   */
  KVVariable = 'KVVariable',
  /**
   * The variable is a list.
   */
  ListVariable = 'ListVariable',
}

export enum VariableChannel {
  /**
   * The variable is a custom variable.
   */
  Custom = 'custom',
  /**
   * The variable is a system variable.
   */
  System = 'system',
  /**
   * The variable is a location variable.
   */
  Location = 'location',
  /**
   * The variable is a Feishu variable.
   */
  Feishu = 'feishu',
  /**
   * The variable is an app variable.
   */
  APP = 'app',
}

export interface BotVariable {
  /**
   * The name of the variable.
   */
  keyword: string;
  /**
   * The default value of the variable.
   */
  default_value: string;
  /**
   * The type of the variable.
   */
  variable_type: VariableType;
  /**
   * The source of the variable.
   */
  channel: VariableChannel;
  /**
   * The description of the variable.
   */
  description: string;
  /**
   * Whether the variable is enabled.
   */
  enable: boolean;
  /**
   * Whether the variable is supported in the prompt.
   */
  prompt_enable: boolean;
}
