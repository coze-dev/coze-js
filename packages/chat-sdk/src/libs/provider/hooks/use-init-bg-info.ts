import { useChatInfoStore, useChatPropsStore } from '@/libs/provider';

export const useInitBgInfo = () => {
  const bgInfoFromProps = useChatPropsStore(store => store.chat.bgInfo);
  const bgInfo = useChatInfoStore(store => store.info?.bgInfo);
  const bgInfoResult = bgInfoFromProps || bgInfo;
  return bgInfoResult;
};
