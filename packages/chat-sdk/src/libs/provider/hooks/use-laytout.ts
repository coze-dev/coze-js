import { useChatPropsStore } from '@/libs/provider';

export const useLayout = () => {
  const layout = useChatPropsStore(store => store.ui?.layout);
  return layout === 'mobile' ? 'mobile' : 'pc';
};
export const useIsMobile = () => useLayout() === 'mobile';
