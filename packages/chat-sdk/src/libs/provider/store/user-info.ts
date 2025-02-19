import { create } from "zustand";

import { logger, nanoid } from "@/libs/utils";
import type { UserInfoStore, UserInfo } from "@/libs/types";
import { useChatPropsContext } from "../context";
import { useMemo } from "react";
import { useUpdateEffect } from "@/libs/hooks";
const createUserInfoStore = ({ user }: { user: UserInfo }) => {
  const defaultInfo = {
    id: user?.id || nanoid(),
  };
  return create<UserInfoStore>()((set) => ({
    info: { ...defaultInfo, ...user },
    setUserInfo: (info: UserInfo) => {
      set({
        info: { ...defaultInfo, ...(info || {}) },
      });
    },
  }));
};

export type CreateUserInfoStore = ReturnType<typeof createUserInfoStore>;

export const useCreateUserInfoStore = () => {
  const chatProps = useChatPropsContext();
  const userInfoStore = useMemo(
    () => createUserInfoStore({ user: chatProps?.user }),
    []
  );
  useUpdateEffect(() => {
    userInfoStore.getState().setUserInfo(chatProps.user);
    logger.debug("useCreateUserInfoStore in userUpdateEffect", chatProps.user);
  }, [chatProps]);
  return userInfoStore;
};
