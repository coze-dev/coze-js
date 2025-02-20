import { useEffect, useMemo } from 'react';

import { create } from 'zustand';
import { Events } from '@tarojs/taro';

import type { UiEventStore } from '@/libs/types';
const createUiEventStore = () =>
  create<UiEventStore>()(() => ({
    event: new Events(),
  }));

export type CreateUiEventStore = ReturnType<typeof createUiEventStore>;

export const useCreateUiEventStore = () => {
  const uiEventStore = useMemo(() => createUiEventStore(), []);
  useEffect(
    () => () => {
      uiEventStore.getState().event.off();
    },
    [],
  );
  return uiEventStore;
};
