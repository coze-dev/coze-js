import { openSetting, getSetting } from '@tarojs/taro';

export const getAndOpenSetting = async authNameList => {
  try {
    const { authSetting = [] } = await getSetting();
    if (authNameList.some(item => !authSetting[item])) {
      const { authSetting: authSettingNew } = await openSetting();
      const unAuthNameList = authNameList.filter(item => !authSettingNew[item]);
      return {
        code: unAuthNameList.length === 0 ? 0 : 1,
        unAuthNameList,
      };
    } else {
      return {
        code: 0,
        unAuthNameList: [],
      };
    }
  } catch (_e) {
    return {
      code: 1,
      unAuthNameList: authNameList,
    };
  }
};
