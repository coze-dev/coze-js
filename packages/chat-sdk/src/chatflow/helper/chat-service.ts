import {
  StreamChatReq,
  RequestOptions,
  StreamChatData,
  type ChatWorkflowReq,
  CreateConversationReq,
} from '@coze/api';

import {
  getCdnUrl,
  logger,
  MiniChatError,
  MiniChatErrorCode,
} from '@/libs/utils';
import { SuggestPromoteInfo } from '@/libs/types/base/chat';
import {
  BgImageInfo,
  ChatInfo,
  ChatService,
  type ChatServiceProps,
} from '@/libs';

import { type IChatFlowProps } from '../type';
import { getConnectorId } from './get-connector-id';
import type {
  ProjectInfoResp,
  WorkflowInfoResp,
  BackgroundImageResp,
} from './chat-service-type';

// eslint-disable-next-line complexity
export const getCustomAppInfo = (chatFlowProps: IChatFlowProps) => {
  let bgInfo: BgImageInfo | undefined;
  if (chatFlowProps.areaUi?.bgInfo && chatFlowProps.areaUi?.bgInfo?.imgUrl) {
    bgInfo = {
      imgUrl: chatFlowProps.areaUi.bgInfo.imgUrl,
      themeColor: chatFlowProps.areaUi.bgInfo.themeColor,
      gradientPosition: {
        left: 0,
        right: 0,
      },
      canvasPosition: {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      },
    };
  }
  return {
    name: chatFlowProps?.project?.name,
    icon_url: chatFlowProps?.project?.iconUrl,
    onboarding_info: {
      prologue: chatFlowProps?.project?.onBoarding?.prologue || '',
      suggested_questions:
        chatFlowProps?.project?.onBoarding?.suggestions || [],
    },
    description: chatFlowProps.project?.desc,
    suggestPromoteInfo: chatFlowProps.project?.suggestPromoteInfo,
    bgInfo: bgInfo
      ? {
          pc: bgInfo,
          mobile: bgInfo,
        }
      : undefined,
  };
};

// eslint-disable-next-line complexity
export const getBgInfo = (
  resp?: BackgroundImageResp,
): BgImageInfo | undefined => {
  if (resp?.origin_image_url) {
    return {
      canvasPosition: {
        height: resp.canvas_position?.height || 0,
        left: resp.canvas_position?.left || 0,
        top: resp.canvas_position?.top || 0,
        width: resp.canvas_position?.width || 0,
      },
      gradientPosition: {
        left: resp.gradient_position?.left || 0,
        right: resp.gradient_position?.right || 0,
      },
      imgUrl: resp.origin_image_url || '',
      themeColor: resp.theme_color || '',
    };
  }
};
// eslint-disable-next-line complexity
export const combineRequestOptions = (
  appData?: ProjectInfoResp['data'],
  workflowData?: WorkflowInfoResp['role'],
  chatFlowProps?: IChatFlowProps,
) => {
  const { icon_url: iconUrl, name = '' } = appData || {};

  const appInfoResult: Partial<ChatInfo> = {
    name,
    icon_url: iconUrl,
    description: '',
    create_time: 0,
    update_time: 0,
    version: '',
  };
  appInfoResult.onboarding_info = { prologue: '', suggested_questions: [] };
  appInfoResult.name =
    workflowData?.name ||
    appInfoResult.name ||
    chatFlowProps?.project?.defaultName;
  appInfoResult.icon_url =
    workflowData?.avatar?.image_url ||
    appInfoResult.icon_url ||
    chatFlowProps?.project.defaultIconUrl;

  appInfoResult.onboarding_info = {
    prologue: workflowData?.onboarding_info?.prologue || '',
    display_all_suggestions:
      workflowData?.onboarding_info?.display_all_suggestions,
    suggested_questions:
      workflowData?.onboarding_info?.suggested_questions?.filter(
        item => !!item,
      ) || [],
  };
  appInfoResult.suggestPromoteInfo = workflowData?.suggest_reply_info
    ? {
        suggestReplyMode: workflowData?.suggest_reply_info?.suggest_reply_mode,
        customizedSuggestPrompt:
          workflowData?.suggest_reply_info?.customized_suggest_prompt,
      }
    : undefined;
  appInfoResult.bgInfo = {
    pc: getBgInfo(workflowData?.background_image_info?.web_background_image),
    mobile: getBgInfo(
      workflowData?.background_image_info?.mobile_background_image,
    ),
  };
  appInfoResult.voiceInfo = {
    isTextToVoiceEnable: workflowData?.audio_config?.is_text_to_voice_enable,
    voiceConfigMap: workflowData?.audio_config?.voice_config_map,
  };
  appInfoResult.inputMode = {
    default: workflowData?.user_input_config?.default_input_mode,
  };
  return appInfoResult;
};

export class ChatFlowService extends ChatService {
  private chatFlowProps: IChatFlowProps;
  constructor(props: ChatServiceProps, chatFlowProps: IChatFlowProps) {
    super(props);
    this.chatFlowProps = chatFlowProps;
  }
  updateChatFlowProps(chatFlowProps: IChatFlowProps) {
    this.chatFlowProps = chatFlowProps;
  }
  async createNewConversation() {
    return this._createNewConversation(false);
  }
  // eslint-disable-next-line complexity
  async getAppInfo() {
    const connectorId = getConnectorId(this.chatFlowProps);
    const isWebSdk = this.chatFlowProps?.project?.mode === 'websdk';
    const [appRes, workflowRes] = await Promise.allSettled([
      isWebSdk
        ? this.apiClient?.get<unknown, ProjectInfoResp>(
            `/v1/apps/${this.chatFlowProps?.project?.id}?connector_id=${connectorId}`,
          )
        : null,
      this.chatFlowProps?.workflow?.id
        ? this.apiClient?.get<unknown, { data: WorkflowInfoResp }>(
            `/v1/workflows/${this.chatFlowProps?.workflow?.id}?${[
              `connector_id=${connectorId}`,
              `is_debug=${
                this.chatFlowProps?.project?.mode === 'draft' ? 'true' : ''
              }`,
              `caller=${this.chatFlowProps?.project?.caller || ''}`,
            ].join('&')}`,
          )
        : null,
    ]);
    const appData =
      appRes?.status === 'fulfilled' ? appRes?.value?.data : undefined;
    const workflowData =
      workflowRes?.status === 'fulfilled'
        ? workflowRes?.value?.data?.role
        : undefined;
    logger.debug('Get Workflow Info: ', { appRes, workflowRes });
    if (isWebSdk && !appData) {
      throw new MiniChatError(
        MiniChatErrorCode.SDK_API_APP_UnPublished,
        'The app is not published',
      );
    }
    // 默认数据不用合并进去
    const appInfo = combineRequestOptions(appData, workflowData);
    if (this.chatFlowProps?.workflow?.id && !appInfo.icon_url) {
      appInfo.icon_url = getCdnUrl(
        this.chatFlowProps.setting?.cdnBaseUrlPath,
        'assets/imgs/chatflow-logo.png',
      );
    }

    logger.debug('Get Workflow Info(Combine):', appInfo);
    return {
      appId: this.appId,
      type: this.chatType,
      ...appInfo,
    };
  }
  getOrCreateConversationId() {
    return this._createNewConversation(true);
  }
  private async _createNewConversation(isCreateNew = false) {
    if (this.chatFlowProps?.project?.type === 'bot') {
      const { id: conversationId, last_section_id: sectionId = '' } =
        await this.apiClient.conversations.create({
          // @ts-expect-error -- linter-disable-autofix
          connector_id: this.connectorId,
        });
      return { conversationId, sectionId };
    } else {
      const { id: conversationId, last_section_id: sectionId = '' } =
        await this.apiClient.conversations.create({
          app_id: this.appId,
          conversation_name: this.chatFlowProps?.project?.conversationName,
          get_or_create: isCreateNew,
          workflow_id: this.chatFlowProps?.workflow?.id,
          draft_mode: this.chatFlowProps?.project?.mode === 'draft',
          connector_id: getConnectorId(this.chatFlowProps),
        } as unknown as CreateConversationReq);
      return { conversationId, sectionId };
    }
  }
  // eslint-disable-next-line complexity
  asyncChat(
    params: StreamChatReq & {
      connector_id?: string;
      suggestPromoteInfo?: SuggestPromoteInfo;
    },
    options?: RequestOptions,
  ): AsyncIterable<StreamChatData> {
    const bodyData: Record<string, unknown> = {};
    bodyData.additional_messages = params.additional_messages || [];
    bodyData.connector_id = params.connector_id;
    bodyData.conversation_id = params.conversation_id;

    bodyData.workflow_id = this.chatFlowProps?.workflow?.id;
    bodyData.parameters = this.chatFlowProps?.workflow?.parameters;
    bodyData.execute_mode =
      this.chatFlowProps?.project?.mode === 'draft' ? 'DEBUG' : undefined;
    bodyData.app_id =
      this.chatFlowProps?.project?.type === 'app'
        ? this.chatFlowProps?.project?.id
        : undefined;
    bodyData.bot_id =
      this.chatFlowProps?.project?.type === 'bot'
        ? this.chatFlowProps?.project?.id
        : undefined;

    bodyData.connector_id = getConnectorId(this.chatFlowProps);
    bodyData.ext = {
      _caller: this.chatFlowProps?.project?.caller,
      user_id: params.user_id,
    };
    bodyData.suggest_reply_info = params.suggestPromoteInfo
      ? {
          suggest_reply_mode: params.suggestPromoteInfo?.suggestReplyMode,
          customized_suggest_prompt:
            params.suggestPromoteInfo?.customizedSuggestPrompt,
        }
      : undefined;
    const optionNew = options || {};
    optionNew.headers = {
      ...(options?.headers || {}),
      ...(this.chatFlowProps?.workflow?.header || {}),
    };
    return this.apiClient.workflows.chat.stream(
      bodyData as unknown as ChatWorkflowReq,
      optionNew,
    );
  }
}
