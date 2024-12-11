import { useEffect, useState } from 'react';

import {
  getOrRefreshToken,
  isTeamWorkspace,
  redirectToLogin,
} from '../utils/utils';
import { LocalManager, LocalStorageKey } from '../utils/local-manager';

export const useAccessToken = () => {
  const [localManager, setLocalManager] = useState<LocalManager | null>(null);

  const removeAccessToken = () => {
    localManager?.remove(LocalStorageKey.ACCESS_TOKEN);
  };
  const initLocalManager = () => {
    const lm = new LocalManager(
      isTeamWorkspace() ? LocalStorageKey.WORKSPACE_PREFIX : '',
    );
    setLocalManager(lm);
  };

  const getAccessToken = async () => {
    const lm = new LocalManager(
      isTeamWorkspace() ? LocalStorageKey.WORKSPACE_PREFIX : '',
    );
    const token = await getOrRefreshToken(lm);
    if (!token) {
      const workspaceId = localStorage.getItem(LocalStorageKey.WORKSPACE_ID);
      const pureWorkspaceId = workspaceId?.split('_')[1];
      await redirectToLogin(isTeamWorkspace(), pureWorkspaceId);
    }
    return token;
  };

  useEffect(() => {
    initLocalManager();
  }, []);

  return {
    getAccessToken,
    removeAccessToken,
    initLocalManager,
  };
};
