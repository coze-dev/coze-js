export const config = {
  getBaseUrl: () =>
    localStorage.getItem('chat-x_base_url') || 'https://api.coze.com',
  getPat: () => localStorage.getItem('chat-x_pat') || '',
  getBotId: () => localStorage.getItem('chat-x_bot_id') || '',
};
