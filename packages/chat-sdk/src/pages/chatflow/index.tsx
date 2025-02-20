import { useState } from 'react';

import { View } from '@tarojs/components';

import UserIcon from '@/libs/ui-kit/assets/imgs/coze-logo.png';
import { ChatSlot } from '@/libs';
import { IChatFlowProps } from '@/chatflow/type';
import { ChatFlowFramework } from '@/chatflow';

import styles from './index.module.less';

export const cnBotInfo = {
  appId: '7472176199100645402',
  workflowId: '7472209247696551955',
  apiBaseUrl: 'https://api.coze.cn',
  conversationName: 'Test3',
  tokenType: 'external',
  token: 'pat_CCit2upKNLH778OtaoAspgyYYh5clTvg****************',
};
export const enBotInfo = {
  appId: '7329529575539572743',
  apiBaseUrl: 'https://api.coze.com',
  token: 'pat_CCit2upKNLH778OtaoAspgyYYh5clTvg****************',
};
export const boeBotInfo = {
  appId: '7440555625941631020',
  workflowId: '7441166757690064940',
  apiBaseUrl: 'https://api-bot-boe.bytedance.net',
  tokenType: 'internal',
  conversationName: 'Chatflow3',
  token: 'pat_CCit2upKNLH778OtaoAspgyYYh5clTvg****************',
};

const botInfo = cnBotInfo;

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
    cdnBaseUrlPath:
      'https://lf3-static.bytednsdoc.com/obj/eden-cn/rkzild_lgvj/ljhwZthlaukjlkulzlp/',
    requestHeader: {
      'x-tt-env': 'ppe_chatflow_role',
      'x-use-ppe': '1',
    },
  };
  const [onBoarding, setOnBoarding] = useState({
    suggestions: [
      'asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf asdf ',
    ],
  });
  const [userInfo, setUserInfo] = useState({
    id: 'ID1234567890',
    name: 'GaoTest',
    avatar: UserIcon,
  });
  const [project, setProject] = useState<IChatFlowProps['project']>({
    id: botInfo.appId,
    type: 'app',
    conversationName: botInfo.conversationName || 'asf',
    name: 'https://www.coze.cn/space/7321567613585424403/project-ide/7459982518834446351/workflow/7459756038184026112',
    mode: 'draft',
    onBoarding,
  });
  const [areaUi, setAreaUi] = useState<IChatFlowProps['areaUi']>({
    layout: 'pc',
    isDisabled: false,
    isMiniCustomHeader: false,
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
      placeholder: '请输入你的s问题',
      isNeed: true,
      isNeedTaskMessage: true,
      isNeedAudio: true,

      renderChatInputTopSlot: () => <div> Input Top Slot</div>,
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
              message: {
                afterMessageReceivedFinish: props => {
                  console.log('afterMessageReceivedFinish:', props);
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

const ChatFlowNode = () => <ChatSlot className={styles.ChatSlot} />;
