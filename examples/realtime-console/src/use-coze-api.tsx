import { useEffect, useState } from 'react';

import { CozeAPI } from '@coze/api';

export interface VoiceOption {
  label: React.ReactNode;
  value: string;
  preview_url?: string;
  name: string;
  language_name: string;
  is_system_voice: boolean;
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

const useCozeAPI = ({
  accessToken,
  baseURL,
}: {
  accessToken: string;
  baseURL: string;
}) => {
  const [api, setApi] = useState<CozeAPI | null>(null);

  useEffect(() => {
    if (accessToken && baseURL) {
      setApi(
        new CozeAPI({
          token: accessToken,
          baseURL,
          allowPersonalAccessTokenInBrowser: true,
        }),
      );
    }
  }, [accessToken, baseURL]);

  const fetchAllBots = async (workspaceId?: string): Promise<BotOption[]> => {
    let pageIndex = 1;
    const pageSize = 20;
    let allBots: BotOption[] = [];
    let hasMore = true;
    if (!workspaceId) {
      throw new Error('workspaceId is required');
    }

    try {
      while (hasMore) {
        const response = await api?.bots.list({
          space_id: workspaceId,
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

      // Merge and format voice list
      const formattedVoices = [...customVoices, ...systemVoices].map(voice => ({
        value: voice.voice_id,
        preview_url: voice.preview_audio,
        name: voice.name,
        language_name: voice.language_name,
        is_system_voice: voice.is_system_voice,
        label: `${voice.name} (${voice.language_name})`,
      }));

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

        const workspaces =
          response?.workspaces.map(workspace => ({
            value: workspace.id,
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

  return {
    api,
    fetchAllVoices,
    fetchAllBots,
    fetchAllWorkspaces,
  };
};

export default useCozeAPI;
