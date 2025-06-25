import { CozeAPI, type Voice } from '@coze/api';

import getConfig from '../../utils/config';
import { getTokenByCookie } from '../../utils';

const getCozeApi = async (localStorageKey: string) => {
  const config = getConfig(localStorageKey);
  const expiresIn = config.getExpiresIn();
  if (expiresIn && parseInt(expiresIn) * 1000 < Date.now()) {
    console.log('Token expired!');
    const oauthToken = await getTokenByCookie();
    if (oauthToken) {
      localStorage.setItem(`${localStorageKey}_pat`, oauthToken.access_token);
      localStorage.setItem(
        `${localStorageKey}_expires_in`,
        oauthToken.expires_in.toString(),
      );
    }
  }
  const cozeApi = new CozeAPI({
    baseURL: config.getBaseUrl(),
    allowPersonalAccessTokenInBrowser: true,
    token: config.getPat(),
  });
  return cozeApi;
};

const useApi = (localStorageKey: string) => {
  const isRelease = () => location.hostname === 'www.coze.cn';

  const getBotInfo = async (botId: string) => {
    const api = await getCozeApi(localStorageKey);
    const bot = await api.bots.retrieveNew(botId);
    return bot;
  };

  const getBots = async (workspaceId: string) => {
    const api = await getCozeApi(localStorageKey);
    const bots = await api.bots.listNew({
      workspace_id: workspaceId,
      page_num: 1,
      page_size: 50,
    });
    return bots.items;
  };

  const getWorkspaces = async () => {
    const api = await getCozeApi(localStorageKey);
    const workspaces = await api.workspaces.list({
      page_num: 1,
      page_size: 50,
    });
    return workspaces.workspaces;
  };

  const getVoices = async () => {
    try {
      const api = await getCozeApi(localStorageKey);
      const pageSize = 100;
      let pageNum = 1;
      let hasMore = true;
      let allVoices: Voice[] = [];
      while (hasMore) {
        const response = await api.audio.voices.list({
          page_size: pageSize,
          page_num: pageNum,
        });
        hasMore = response?.has_more || false;
        allVoices = [...allVoices, ...(response?.voice_list || [])];
        pageNum++;
      }

      // Separate system voices and custom voices
      const customVoices = allVoices.filter(voice => !voice.is_system_voice);
      const systemVoices = allVoices.filter(voice => voice.is_system_voice);

      // Group system voices by language
      const systemVoicesByLanguage = systemVoices.reduce<
        Record<string, typeof systemVoices>
      >((acc, voice) => {
        const languageName = voice.language_name;
        if (!acc[languageName]) {
          acc[languageName] = [];
        }
        acc[languageName].push(voice);
        return acc;
      }, {});

      // Sort languages alphabetically and flatten voices
      const sortedSystemVoices = Object.entries(systemVoicesByLanguage)
        .sort(([langA], [langB]) => langB.localeCompare(langA))
        .flatMap(([, voices]) => voices);

      // Merge custom voices with sorted system voices and format
      const formattedVoices = [...customVoices, ...sortedSystemVoices].map(
        voice => ({
          value: voice.voice_id,
          preview_url: voice.preview_audio,
          name: voice.name,
          language_code: voice.language_code,
          language_name: voice.language_name,
          is_system_voice: voice.is_system_voice,
          label: `${voice.name} (${voice.language_name})`,
          preview_text: voice.preview_text,
          available_training_times: voice.available_training_times,
        }),
      );

      return formattedVoices;
    } catch (error) {
      console.error('get voices error:', error);
      throw error;
    }
  };

  return {
    isRelease,
    getBots,
    getWorkspaces,
    getBotInfo,
    getVoices,
  };
};

export default useApi;
