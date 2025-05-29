const getConfig = (prefix: string) => {
  const config = {
    getBaseUrl: () =>
      localStorage.getItem(`${prefix}_base_url`) || 'https://api.coze.cn',
    getBaseWsUrl: () =>
      localStorage.getItem(`${prefix}_base_ws_url`) || 'wss://ws.coze.cn',
    getPat: () => localStorage.getItem(`${prefix}_pat`) || '',
    getBotId: () => localStorage.getItem(`${prefix}_bot_id`) || '',
    getVoiceId: () => localStorage.getItem(`${prefix}_voice_id`) || '',
    getWorkflowId: () => localStorage.getItem(`${prefix}_workflow_id`) || '',
    getTurnDetection: () =>
      localStorage.getItem(`${prefix}_turn_detection`) || 'server_vad',
  };
  return config;
};

export default getConfig;
