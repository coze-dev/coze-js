import { useEffect, useState } from 'react';

import { CozeAPI, type WorkSpace, type CloneVoiceReq } from '@coze/api';

import { getBaseUrl, getOrRefreshToken, redirectToLogin } from '../utils/utils';
import { LocalManager } from '../utils/local-manager';

export interface VoiceOption {
  label: React.ReactNode;
  value: string;
  preview_url?: string;
  name: string;
  language_code: string;
  language_name: string;
  is_system_voice: boolean;
  available_training_times: number;
  preview_text: string;
}

export interface BotOption {
  value: string;
  label: string;
  avatar?: string;
}

export interface WorkspaceOption {
  value: string;
  label: string;
}

const useCozeAPI = () => {
  const [api, setApi] = useState<CozeAPI | null>(null);
  const localManager = new LocalManager();

  useEffect(() => {
    const init = async () => {
      const accessToken = await getOrRefreshToken(localManager);
      const baseURL = getBaseUrl();
      if (accessToken && baseURL) {
        setApi(
          new CozeAPI({
            token: accessToken,
            baseURL,
          }),
        );
      } else {
        console.error('accessToken is not found');
        await redirectToLogin(false);
      }
    };
    init();
  }, []);

  const fetchAllBots = async (workspaceId?: string): Promise<BotOption[]> => {
    let pageIndex = 1;
    const pageSize = 20;
    let allBots: BotOption[] = [];
    let hasMore = true;
    if (!workspaceId) {
      throw new Error('workspaceId is required');
    }
    if (!workspaceId.includes('_')) {
      throw new Error('workspaceId is invalid');
    }

    const pureWorkspaceId = workspaceId.split('_')[1];

    try {
      while (hasMore) {
        const response = await api?.bots.list({
          space_id: pureWorkspaceId,
          page_size: pageSize,
          page_index: pageIndex,
        });

        const bots: BotOption[] =
          response?.space_bots.map(bot => ({
            value: bot.bot_id,
            label: bot.bot_name,
            avatar: bot.icon_url,
          })) || [];

        allBots = [...allBots, ...bots];
        console.log(`load ${pageIndex} page bots`, bots);

        hasMore = response?.space_bots.length === pageSize;
        pageIndex++;
      }

      return allBots;
    } catch (error) {
      console.error('get bots error:', error);
      throw error;
    }
  };

  const fetchAllVoices = async (): Promise<VoiceOption[]> => {
    try {
      const response = await api?.audio.voices.list();

      // Separate system voices and custom voices
      const customVoices =
        response?.voice_list.filter(voice => !voice.is_system_voice) || [];
      const systemVoices =
        response?.voice_list.filter(voice => voice.is_system_voice) || [];

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

  const fetchAllWorkspaces = async (): Promise<WorkspaceOption[]> => {
    let pageNum = 1;
    const pageSize = 50;
    let allWorkspaces: WorkspaceOption[] = [];
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await api?.workspaces.list({
          page_size: pageSize,
          page_num: pageNum,
        });

        const getWorkspacePrefix = (workspace: WorkSpace) => {
          if (
            workspace.workspace_type === 'personal' ||
            workspace.role_type === 'owner'
          ) {
            return 'personal';
          }
          return 'team';
        };
        const workspaces =
          response?.workspaces.map(workspace => ({
            value: `${getWorkspacePrefix(workspace)}_${workspace.id}`,
            label: workspace.name,
          })) || [];

        allWorkspaces = [...allWorkspaces, ...workspaces];

        hasMore = response?.workspaces.length === pageSize;
        pageNum++;
      }

      return allWorkspaces;
    } catch (error) {
      console.error('get workspaces error:', error);
      throw error;
    }
  };

  const cloneVoice = async (params: CloneVoiceReq): Promise<string> => {
    try {
      const response = await api?.audio.voices.clone(params);
      return response?.voice_id || '';
    } catch (error) {
      console.error('clone voice error:', error);
      throw error;
    }
  };

  return {
    api,
    fetchAllVoices,
    fetchAllBots,
    fetchAllWorkspaces,
    cloneVoice,
  };
};

export default useCozeAPI;
