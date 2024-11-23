export const config = {
  getBaseUrl: () =>
    localStorage.getItem('voice_base_url') || 'https://api.coze.com',
  getPat: () => localStorage.getItem('voice_pat') || '',
  getBotId: () => localStorage.getItem('voice_bot_id') || '',
  getVoiceFileId: () => localStorage.getItem('voice_voice_file_id') || '',
};
