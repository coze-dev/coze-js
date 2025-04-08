import getConfig from '../utils/config';

const useTokenWithPat = (localStorageKey: string) => {
  const config = getConfig(localStorageKey);
  const getToken = () => config.getPat();
  return {
    getToken,
  };
};

export { useTokenWithPat };
