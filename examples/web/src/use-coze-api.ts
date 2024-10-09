import { CozeAPI, getOAuthToken, getAuthenticationUrl, getPKCEAuthenticationUrl } from '@coze/api';
import { useEffect, useState } from 'react';
import { SettingConfig } from './Setting';

let client: CozeAPI;
const redirectUrl = 'http://localhost:3000';

const useCozeAPI = () => {
  const [message, setMessage] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [fileId, setFileId] = useState('');

  const [config, setConfig] = useState<SettingConfig>({
    authType: 'pat_token',
    token: '',
    botId: '',
    clientId: '',
    clientSecret: '',
    baseUrl: '',
  });

  useEffect(() => {
    const config = JSON.parse(sessionStorage.getItem('settingConfig') || '{}') as SettingConfig;

    if (config && config.authType) {
      if (config.authType === 'pat_token') {
        initClient(config);
      } else if (config.authType === 'oauth_token' || config.authType === 'oauth_pkce') {
        if (config.token) {
          initClient(config);
          return;
        }
        // get code from url
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        if (code) {
          const codeVerifier = sessionStorage.getItem('codeVerifier') || '';
          // get oauth token
          getOAuthToken({
            baseURL: config.baseUrl,
            code,
            clientId: config.clientId || '',
            redirectUrl,
            clientSecret: config.clientSecret || '',
            codeVerifier: config.authType === 'oauth_pkce' ? codeVerifier : '',
          })
            .then(res => {
              config.token = res.access_token;
              sessionStorage.setItem('settingConfig', JSON.stringify(config));

              initClient(config);
            })
            .finally(() => {
              params.delete('code');
              window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
            });
        }
      }
    }
  }, []);

  async function initClient(config: SettingConfig) {
    setConfig(config);

    if (config.authType === 'oauth_token' && !config.token) {
      window.location.href = getAuthenticationUrl({ baseURL: config.baseUrl, clientId: config.clientId || '', redirectUrl, state: '' });
      return;
    }

    if (config.authType === 'oauth_pkce' && !config.token) {
      const { url, codeVerifier } = await getPKCEAuthenticationUrl({
        baseURL: config.baseUrl,
        clientId: config.clientId || '',
        redirectUrl,
        state: '',
      });
      sessionStorage.setItem('codeVerifier', codeVerifier);
      window.location.href = url;
      return;
    }

    if (!config.token) {
      return;
    }

    client = new CozeAPI({
      token: config.token || '',
      baseURL: config.baseUrl,
    });
    setIsReady(true);
  }

  async function streamingChat(query: string) {
    let messages: any[];
    if (fileId) {
      messages = [
        {
          role: 'user',
          content: [
            { type: 'file', file_id: fileId },
            { type: 'text', text: query },
          ],
          content_type: 'object_string',
        },
      ];
    } else {
      messages = [
        {
          role: 'user',
          content: query,
          content_type: 'text',
        },
      ];
    }

    const v = await client.chat.stream({
      bot_id: config.botId,
      user_id: '1234567890',
      auto_save_history: true,
      additional_messages: messages,
    });

    let msg = '';

    for await (const part of v) {
      if (typeof part === 'string') {
        continue;
      }
      if (part.event === 'conversation.chat.created') {
        console.log('[START]');
      } else if (part.event === 'conversation.message.delta') {
        msg += part.data.content;

        setMessage(msg);
      } else if (part.event === 'conversation.message.completed') {
        const { role, type, content } = part.data;
        if (role === 'assistant' && type === 'answer') {
          msg += '\n';
          setMessage(msg);
        } else {
          console.log('[%s]:[%s]:%s', role, type, content);
        }
      } else if (part.event === 'conversation.chat.completed') {
        console.log(part.data.usage);
      } else if (part.event === 'done') {
        console.log(part.data);
      }
    }
    console.log('=== End of Streaming Chat ===');
  }

  const sendMessage = async (query: string) => {
    setMessage('');
    await streamingChat(query);
  };

  const uploadFile = async (file: File) => {
    setIsReady(false);
    try {
      const res = await client.files.create({ file });
      setFileId(res.id);
      setIsReady(true);
      console.log(res);
    } catch (e) {
      console.error(e);
    }
  };

  return { message, sendMessage, initClient, isReady, uploadFile };
};

export { useCozeAPI };
