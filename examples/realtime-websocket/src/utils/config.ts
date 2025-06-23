const getConfig = (prefix: string) => {
  const config = {
    getBaseUrl: () =>
      localStorage.getItem(`${prefix}_base_url`) || 'https://api.coze.cn',
    getBaseWsUrl: () =>
      localStorage.getItem(`${prefix}_base_ws_url`) || 'wss://ws.coze.cn',
    getPat: () => localStorage.getItem(`${prefix}_pat`) || '',
    getExpiresIn: () => localStorage.getItem(`${prefix}_expires_in`) || '',
    getBotId: () => localStorage.getItem(`${prefix}_bot_id`) || '',
    getVoiceId: () => localStorage.getItem(`${prefix}_voice_id`) || '',
    getWorkflowId: () => localStorage.getItem(`${prefix}_workflow_id`) || '',
    getChatUpdate: () => JSON.parse(localStorage.getItem('chatUpdate') || '{}'),
  };
  return config;
};

export default getConfig;
