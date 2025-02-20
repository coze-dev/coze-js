import { View } from '@tarojs/components';

import { ChatType, Language } from '@/libs/types';
import { ChatFramework, ChatSlot } from '@/libs';

export const cnBotInfo = {
  appId: '7471201872620371995',
  apiBaseUrl: 'https://api.coze.cn',
  token: 'pat_5qMu2RQCXh9kYEkLEoa2yUZyW7hSUXxo**************',
};
export const enBotInfo = {
  appId: '7329529575539572743',
  apiBaseUrl: 'https://api.coze.com',
  token: 'pat_5qMu2RQCXh9kYEkLEoa2yUZyW7hSUXxo**************',
};
export const boeBotInfo = {
  appId: '7328406676364132396',
  apiBaseUrl: 'https://api-bot-boe.bytedance.net',
  token: 'pat_5qMu2RQCXh9kYEkLEoa2yUZyW7hSUXxo**************',
};

const botInfo = cnBotInfo;

import styles from './index.module.less';

import { useEffect } from 'react';

import { isWeb } from '@/libs/utils';

export default function Index() {
  useEffect(() => {
    if (isWeb) {
      const c = document.createElement('script');
      c.src = 'http://res.wx.qq.com/open/js/jweixin-1.6.0.js';
      document.body.appendChild(c);
    }
  }, []);
  return (
    <View className={styles.container}>
      <View className={styles['chat-container']}>
        <ChatFramework
          chat={{
            appId: botInfo.appId,
            type: ChatType.Bot,
            name: '',
            icon_url: 'asfsdf',
            voiceInfo: {
              isTextToVoiceEnable: true,
              voiceConfigMap: {
                zh: {
                  voice_id: '7426720361733046281',
                  name: '7426720361733046281',
                },
                en: {
                  voice_id: '7426720361733046281',
                  name: '7426720361733046281',
                },
              },
            },
          }}
          setting={{
            apiBaseUrl: botInfo.apiBaseUrl,
            language: Language.EN,
            requestHeader: botInfo.requestHeaders,
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
            id: '213',
            name: '高先生',
            avatar:
              'https://p6-passport.byteacctimg.com/img/user-avatar/04628af005e4ca4cecc9f106b4162b3a~300x300.image',
          }}
          ui={{
            layout: 'mobile',
            isMiniCustomHeader: false,
            chatSlot: {
              input: {
                isNeedAudio: true,
                renderChatInputTopSlot: props => (
                  <View>asdfasdfasdf asdfasdfasdf</View>
                ),
              },
              message: {
                card: {
                  isSupportMessage: item => true,
                  renderMessage: props => (
                    <View
                      onClick={() => {
                        alert('123');
                      }}
                    >
                      Card Show Click {props.m}
                    </View>
                  ),
                },
              },
            },
            header: {
              isNeed: true,
              title: 'Coze',
              icon: 'asdfasdf',
            },
            footer: {
              isNeed: true,
              expressionText:
                'Powered by {{test}}. AI-generated content for reference only.',
              linkvars: {
                test: {
                  text: 'baidu',
                  link: 'https://www.baidu.com',
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
