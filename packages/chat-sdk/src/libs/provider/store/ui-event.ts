import { create } from "zustand";

import type { UiEventStore } from "@/libs/types";
import { useEffect, useMemo } from "react";
import { Events } from "@tarojs/taro";
const createUiEventStore = () => {
  return create<UiEventStore>()(() => ({
    event: new Events(),
  }));
};

export type CreateUiEventStore = ReturnType<typeof createUiEventStore>;

export const useCreateUiEventStore = () => {
  const uiEventStore = useMemo(() => createUiEventStore(), []);
  useEffect(() => {
    return () => {
      uiEventStore.getState().event.off();
    };
  }, []);
  return uiEventStore;
};
