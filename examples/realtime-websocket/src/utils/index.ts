import { type OAuthToken } from '@coze/api';

export const getTokenByCookie = async () => {
  try {
    const result = await fetch(
      'https://www.coze.cn/api/permission_api/coze_web_app/impersonate_coze_user',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: '{}',
      },
    ).then(res => res.json());
    console.log('getTokenByCookie', result);
    if (result.code === 700012006) {
      // 未登录
      window.location.href = `/sign?redirect=${encodeURIComponent(
        location.pathname,
      )}`;
    }
    return result.data as OAuthToken;
  } catch (e) {
    console.error('getTokenByCookie', e);
  }
  return null;
};
