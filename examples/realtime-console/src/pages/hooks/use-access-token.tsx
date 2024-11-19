import { useEffect, useState } from 'react';

import {
  getOrRefreshToken,
  isTeamWorkspace,
  redirectToLogin,
} from '../utils/utils';
import { LocalManager, LocalStorageKey } from '../utils/local-manager';

export const useAccessToken = () => {
  const [localManager, setLocalManager] = useState<LocalManager | null>(null);

  const [accessToken, setAccessToken] = useState(
    localManager?.get(LocalStorageKey.ACCESS_TOKEN),
  );

  const removeAccessToken = () => {
    setAccessToken('');
    localManager?.remove(LocalStorageKey.ACCESS_TOKEN);
  };
  const initAccessToken = async () => {
    const lm = new LocalManager(
      isTeamWorkspace() ? LocalStorageKey.WORKSPACE_PREFIX : '',
    );
    setLocalManager(lm);

    const token = await getOrRefreshToken(lm);
    if (token) {
      setAccessToken(token);
    } else {
      const workspaceId = localStorage.getItem(LocalStorageKey.WORKSPACE_ID);
      const pureWorkspaceId = workspaceId?.split('_')[1];
      await redirectToLogin(isTeamWorkspace(), pureWorkspaceId);
    }
  };

  useEffect(() => {
    initAccessToken();
  }, []);

  return {
    accessToken,
    isTeamWorkspace,
    removeAccessToken,
    initAccessToken,
  };
};
