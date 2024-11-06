import { useEffect, useState } from 'react';

import {
  CozeAPI,
  type WorkSpace,
  type CloneVoiceReq,
  type SimpleBot,
} from '@coze/api';

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

const useCozeAPI = ({
  accessToken,
  baseURL = 'https://api.coze.cn',
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

  const getPersonalWorkspace = async (): Promise<WorkSpace | null> => {
    const page_size = 50;
    let page_num = 1;
    let hasMore = true;
    while (hasMore) {
      const workspaces = await api?.workspaces.list({
        page_num,
        page_size,
      });
      console.log(`get workspaces 2: ${workspaces?.workspaces.length}`);
      for (const workspace of workspaces?.workspaces || []) {
        console.log(`get workspace: ${workspace.name} ${workspace.id}`);
        if (workspace.workspace_type === 'personal') {
          return workspace;
        }
      }
      hasMore = workspaces?.workspaces.length === page_size;
      page_num++;
    }
    return null;
  };

  const getBotByName = async (
    workspaceId: string,
    botName: string,
  ): Promise<SimpleBot | null> => {
    let pageIndex = 1;
    const pageSize = 20;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await api?.bots.list({
          space_id: workspaceId,
          page_size: pageSize,
          page_index: pageIndex,
        });

        for (const bot of response?.space_bots || []) {
          if (bot.bot_name === botName) {
            return bot;
          }
        }

        hasMore = response?.space_bots.length === pageSize;
        pageIndex++;
      }

      return null;
    } catch (error) {
      console.error('get getBotByName error:', error);
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

  const cloneVoice = async (params: CloneVoiceReq): Promise<string> => {
    try {
      const response = await api?.audio.voices.clone(params);
      return response?.voice_id || '';
    } catch (error) {
      console.error('clone voice error:', error);
      throw error;
    }
  };

  const getOrCreateRealtimeCallUpBot = async (): Promise<SimpleBot | null> => {
    try {
      // 获取个人空间
      const personalWorkspace = await getPersonalWorkspace();
      if (!personalWorkspace) {
        throw new Error('未找到个人空间');
      }

      const botName = 'realtime-call-up';

      // 获取所有机器人
      const realtimeCallUpBot = await getBotByName(
        personalWorkspace.id,
        botName,
      );

      if (realtimeCallUpBot) {
        return realtimeCallUpBot;
      }

      // 如果不存在，创建新机器人
      const newBot = await api?.bots.create({
        space_id: personalWorkspace.id,
        name: botName,
        description: 'A bot for realtime call up demo',
      });

      if (!newBot) {
        throw new Error('创建机器人失败');
      }

      // 发布到 API 渠道
      await api?.bots.publish({
        bot_id: newBot.bot_id,
        connector_ids: ['API'],
      });

      return {
        bot_id: newBot.bot_id,
        bot_name: botName,
        description: '',
        icon_url: '',
        publish_time: '',
      };
    } catch (error) {
      console.error('获取或创建 realtime-call-up 机器人失败:', error);
      throw error;
    }
  };

  return {
    api,
    fetchAllVoices,
    fetchAllWorkspaces,
    cloneVoice,
    getOrCreateRealtimeCallUpBot,
  };
};

export default useCozeAPI;
