import { type CozeAPI } from '@coze/api';

export interface VoiceOption {
  label: React.ReactNode;
  value: string;
  preview_url?: string;
  name: string;
  language_name: string;
  is_system_voice: boolean;
}

export interface WorkspaceOption {
  value: string;
  label: string;
}

export interface BotOption {
  value: string;
  label: string;
  avatar?: string;
}

export const fetchAllWorkspaces = async (
  api: CozeAPI,
): Promise<WorkspaceOption[]> => {
  let page_num = 1;
  const page_size = 50;
  let allWorkspaces: WorkspaceOption[] = [];
  let hasMore = true;

  try {
    while (hasMore) {
      const response = await api.workspaces.list({
        page_size,
        page_num,
      });

      const workspaces = response.workspaces.map(workspace => ({
        value: workspace.id,
        label: workspace.name,
      }));

      allWorkspaces = [...allWorkspaces, ...workspaces];

      hasMore = response.workspaces.length === page_size;
      page_num++;
    }

    return allWorkspaces;
  } catch (error) {
    console.error('get workspaces error:', error);
    throw error;
  }
};

export const fetchAllBots = async (
  api: CozeAPI,
  workspaceId?: string,
): Promise<BotOption[]> => {
  let page_index = 1;
  const page_size = 20;
  let allBots: BotOption[] = [];
  let hasMore = true;
  if (!workspaceId) {
    throw new Error('workspaceId is required');
  }

  try {
    while (hasMore) {
      const response = await api.bots.list({
        space_id: workspaceId!,
        page_size,
        page_index,
      });

      const bots: BotOption[] = response.space_bots.map(bot => ({
        value: bot.bot_id,
        label: bot.bot_name,
        avatar: bot.icon_url,
      }));

      allBots = [...allBots, ...bots];
      console.log(`load ${page_index} page bots`, bots);

      hasMore = response.space_bots.length === page_size;
      page_index++;
    }

    return allBots;
  } catch (error) {
    console.error('get bots error:', error);
    throw error;
  }
};

export const fetchAllVoices = async (api: CozeAPI): Promise<VoiceOption[]> => {
  try {
    const response = await api.audio.voices.list();

    // Separate system voices and custom voices
    const customVoices = response.voice_list.filter(
      voice => !voice.is_system_voice,
    );
    const systemVoices = response.voice_list.filter(
      voice => voice.is_system_voice,
    );

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
