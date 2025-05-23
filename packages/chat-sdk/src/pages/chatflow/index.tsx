import { useEffect, useState } from 'react';

import { View } from '@tarojs/components';
import { RoleType } from '@coze/api';

import { nanoid } from '@/libs/utils';
import UserIcon from '@/libs/ui-kit/assets/imgs/coze-logo.png';
import {
  ChatSlot,
  useApiClientStore,
  useChatInputStore,
  useConversationStore,
} from '@/libs';
import { IChatFlowProps } from '@/chatflow/type';
import { ChatFlowFramework } from '@/chatflow';

import styles from './index.module.less';

interface EnvInfo {
  appId: string;
  workflowId: string;
  apiBaseUrl: string;
  tokenType: string;
  conversationName: string;
  token: string;
  cdnBaseUrlPath: string;
}
const botInfo: EnvInfo = {
  appId: process.env.TARO_APP_CHATFLOW_COZE_APP_ID ?? '',
  workflowId: process.env.TARO_APP_CHATFLOW_COZE_WORKFLOW_ID ?? '',
  apiBaseUrl: process.env.TARO_APP_CHATFLOW_COZE_API_BASE_URL ?? '',
  conversationName: process.env.TARO_APP_CHATFLOW_COZE_CONVERSATION_NAME ?? '',
  tokenType: process.env.TARO_APP_CHATFLOW_COZE_TOKEN_TYPE ?? '',
  token: process.env.TARO_APP_CHATFLOW_COZE_TOKEN ?? '',
  cdnBaseUrlPath: process.env.TARO_APP_CHATFLOW_COZE_CDN_BASE_URL_PATH ?? '',
};

export default function Index() {
  const [workflow, setWorkflow] = useState({
    id: botInfo.workflowId,
    parameters: {},
  });
  const auth: IChatFlowProps['auth'] = {
    type: (botInfo.tokenType || 'internal') as 'internal' | 'external',
    token: botInfo.token,
    refreshToken: () => botInfo.token,
  };
  const setting: IChatFlowProps['setting'] = {
    apiBaseUrl: botInfo.apiBaseUrl,
    logLevel: 'debug',
    cdnBaseUrlPath: botInfo.cdnBaseUrlPath,
  };
  const [onBoarding, setOnBoarding] = useState({
    suggestions: ['Hello World '],
  });
  const [userInfo, setUserInfo] = useState({
    id: 'ID1234567890',
    name: 'CozeUser',
    avatar: UserIcon,
  });
  const [project, setProject] = useState<IChatFlowProps['project']>({
    id: botInfo.appId,
    type: 'app',
    conversationName: botInfo.conversationName || 'Default',
    //name: 'Coze',
    mode: 'draft',
    connectorId: '10000126',
    onBoarding,
  });
  const [areaUi, setAreaUi] = useState<IChatFlowProps['areaUi']>({
    layout: 'pc',
    isDisabled: false,
    isMiniCustomHeader: false,
    //isFrameAutoFocus: true,
    clearContext: {
      isNeed: true,
    },
    clearMessage: {
      isNeed: true,
    },
    uploadBtn: {
      isNeed: true,
    },
    header: {
      isNeed: true,
      title: 'Test',
      renderRightSlot: () => <View>asdf</View>,
    },
    footer: {
      isNeed: true,
    },
    renderLoading: () => <View className={styles.loading}>Loading</View>,
    input: {
      isNeed: true,
      isNeedTaskMessage: true,
      isNeedAudio: true,
      defaultText: '',
      renderChatInputTopSlot: () => <div> Input Top Slot</div>,
    },
    messageWrapper: {
      senderName: {
        renderRightSlot: ({ isQuery }) =>
          isQuery ? null : (
            <View>
              Right Slot Right Slot Slot Right Slot Slot Right Slot Slot Right
              Slot Slot Right Slot Slot Right Slot
            </View>
          ),
      },
    },
  });
  console.log('chatflow props:', {
    workflow,
    project,
    userInfo,
    areaUi,
    setting,
    auth,
  });
  console.log('chatflow test func', {
    setOnBoarding,
    setUserInfo,
    setProject,
    setAreaUi,
    setWorkflow,
  });
  return (
    <View
      className={styles.container}
      onTouchStart={e => {
        e.stopPropagation(), e.preventDefault();
      }}
      onTouchMove={e => {
        e.stopPropagation(), e.preventDefault();
      }}
    >
      <View className={styles['chat-container']}>
        <ChatFlowFramework
          {...{
            workflow,
            project: {
              ...project,
              caller: 'CANVAS',
              onBoarding,
            },
            userInfo,
            areaUi,
            setting,
            auth,
            eventCallbacks: {
              onGetChatFlowExecuteId: executeId => {
                console.log('onGetChatFlowExecuteId:', executeId);
              },
              onImageClick: extra => {
                console.log('onImageClick:', extra);
              },
              onThemeChange: type => {
                console.log('onThemeChange', type);
              },
              onInitSuccess: () => {
                console.log('onInitSuccess。。。。');
              },
              /*onLinkClick: url => {
                console.log('onLinkClick:', url);
              },*/
              message: {
                afterMessageReceivedFinish: props => {
                  console.log('afterMessageReceivedFinish:', props);
                },
                onRequiresAction: props => {
                  console.log('ForRequireAction onRequiresAction:', props);
                },
              },
            },
          }}
        >
          <ChatFlowNode />
        </ChatFlowFramework>
      </View>
    </View>
  );
}

const ChatFlowNode = () => {
  const apiClient = useApiClientStore(store => store.apiClient);
  const setInputValue = useChatInputStore(store => store.setInputValue);
  const pushMessageList = useConversationStore(store => store.pushMessageList);
  const { conversationId, sectionID } = useConversationStore(store => ({
    conversationId: store.id,
    sectionID: store.sectionId,
  }));
  console.log(
    'ForRequireAction apiClient',
    apiClient,
    setInputValue,
    pushMessageList,
  );
  useEffect(() => {
    pushMessageList([
      {
        id: '1298',
        role: RoleType.User,
        conversation_id: conversationId || '',
        section_id: sectionID,
        bot_id: '',
        chat_id: '123',
        localId: nanoid(),
        meta_data: {},
        content: 'Hello World',
        content_type: 'text',
        created_at: Date.now(),
        updated_at: Date.now(),
        type: 'question',
      },
    ]);
  }, []);

  return <ChatSlot className={styles.ChatSlot} />;
};
