import { request } from '@tarojs/taro';

import { logger } from '@/libs/utils';

import { type IChatFlowProps } from '../type';

export const getToken = async (props: IChatFlowProps) => {
  let token = props.auth?.token;
  let refreshToken = props.auth?.refreshToken;
  if (props.auth?.type === 'internal') {
    token = (await getTokenInternal()) || '';
    refreshToken = getTokenInternal;
  }
  return { token, refreshToken };
};
async function getTokenInternal() {
  try {
    const result = await request({
      url: '/api/permission_api/coze_web_app/impersonate_coze_user',
      method: 'POST',
      dataType: 'json',
      timeout: 30000,
      data: {},
    });
    return result.data?.data?.access_token;
  } catch (_err) {
    logger.error('getTokenInternal error', _err);
    return '';
  }
}
