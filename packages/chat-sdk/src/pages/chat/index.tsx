import { View } from '@tarojs/components';

import { ChatType, Language } from '@/libs/types';
import { ChatFramework, ChatSlot } from '@/libs';

import styles from './index.module.less';
interface EnvInfo {
  appId: string;
  apiBaseUrl: string;
  token: string;
  cdnBaseUrlPath: string;
}
const botInfo: EnvInfo = {
  appId: process.env.TARO_APP_INDEX_COZE_APP_ID ?? '',
  apiBaseUrl: process.env.TARO_APP_INDEX_COZE_API_BASE_URL ?? '',
  token: process.env.TARO_APP_INDEX_COZE_TOKEN ?? '',
  cdnBaseUrlPath: process.env.TARO_APP_INDEX_COZE_CDN_BASE_URL_PATH ?? '',
};

export default function Index() {
  return (
    <View className={styles.container}>
      <View className={styles['chat-container']}>
        <ChatFramework
          chat={{
            appId: botInfo.appId,
            type: ChatType.Bot,
          }}
          setting={{
            apiBaseUrl: botInfo.apiBaseUrl,
            cdnBaseUrlPath: botInfo.cdnBaseUrlPath,
            language: Language.ZH_CN,
            logLevel: 'debug',
          }}
          auth={{
            token: botInfo.token,
            onRefreshToken: oldToken => {
              console.log('oldToken: ', oldToken);
              return botInfo.token;
            },
          }}
          user={{
            id: 'ID1234567890',
            name: 'CozeUser',
            avatar:
              'https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image',
          }}
          ui={{
            layout: 'mobile',
            isMiniCustomHeader: false,
            chatSlot: {
              input: {
                isNeedAudio: true,
                renderChatInputTopSlot: props => <View>Input Slot</View>,
              },
              messageWrapper: {
                senderName: {
                  renderRightSlot: ({ isQuery }) =>
                    isQuery ? null : (
                      <View>
                        Right Slot Right Slot Slot Right Slot Slot Right Slot
                        Slot Right Slot Slot Right Slot Slot Right Slot
                      </View>
                    ),
                },
              },
            },
            header: {
              isNeed: true,
              title: 'Coze',
            },
            footer: {
              isNeed: true,
              expressionText:
                'Powered by {{test}}. AI-generated content for reference only.',
              linkvars: {
                test: {
                  text: 'Coze',
                  link: 'https://www.coze.com',
                },
              },
            },
          }}
        >
          <ChatSlot className={styles['chat-slot']} />
        </ChatFramework>
      </View>
    </View>
  );
}
