import { useChatInfoStore } from "../context";

export const useInitSuccess = () => {
  const { isLoading, error } = useChatInfoStore((store) => ({
    isLoading: store.isLoading,
    error: store.error,
  }));
  return isLoading === false && !error ? true : false;
};
