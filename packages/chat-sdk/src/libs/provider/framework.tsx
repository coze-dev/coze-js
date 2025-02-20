import { FC } from 'react';

import {
  ChatFamePropsProvider,
  ChatStoreProvider,
  type NullChatFrameworkProps,
} from './context';

export const ChatFrameProvider: FC<NullChatFrameworkProps> = ({
  children,
  ...resProps
}) => (
  <ChatFamePropsProvider {...resProps}>
    <ChatStoreProvider>{children}</ChatStoreProvider>
  </ChatFamePropsProvider>
);
