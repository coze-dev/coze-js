import { FC, PropsWithChildren, useEffect } from 'react';

import cls from 'classnames';
import { View } from '@tarojs/components';

import { logger } from '@/libs/utils';
import { CenterAlignedBox, Spinning } from '@/libs/ui-kit';
import { useUpdateEffect } from '@/libs/hooks';
import {
  ChatFramework,
  ChatSlot,
  useConversationStore,
  useInitSuccess,
} from '@/libs';

import { IChatFlowProps } from './type';
import { useInitChat } from './hooks/use-init-chat';

import styles from './index.module.less';

const ChatFlowSlot: FC<PropsWithChildren<IChatFlowProps>> = props => {
  const inProcessChatMessageGroup = useConversationStore(
    store => store.inProcessChatMessageGroup,
  );
  const executeId = inProcessChatMessageGroup?.query?.extData
    ?.executeId as string;
  const onGetChatFlowExecuteId = props?.eventCallbacks?.onGetChatFlowExecuteId;
  useUpdateEffect(() => {
    logger.debug('ChatFlow excuteId', executeId);
    if (executeId && onGetChatFlowExecuteId) {
      onGetChatFlowExecuteId(executeId);
    }
  }, [executeId]);

  const isChatInitSuccess = useInitSuccess();
  useEffect(() => {
    if (isChatInitSuccess) {
      props?.eventCallbacks?.onInitSuccess?.();
    }
  }, [isChatInitSuccess]);
  return (
    <>
      {props.children || (
        <ChatSlot
          className={cls({
            [styles['chat-slot-websdk']]: props.project.mode === 'websdk',
          })}
        />
      )}
    </>
  );
};

export const ChatFlowFramework: FC<
  PropsWithChildren<IChatFlowProps>
> = props => {
  logger.setLoglevel(props?.setting?.logLevel);
  const { chatProps, hasReady } = useInitChat(props);
  const { auth, ...restProps } = props || {};
  logger.info('ChatFlow props', {
    props: restProps,
    hasReady,
    auth: {
      type: auth?.type,
      token: `${auth?.token?.slice(0, 5)}*******${auth?.token?.slice(-5, 5)}`,
    },
  });
  if (!chatProps?.auth || !hasReady) {
    return (
      <CenterAlignedBox className={styles.loading}>
        {props.areaUi?.renderLoading ? (
          props.areaUi?.renderLoading()
        ) : (
          <Spinning />
        )}
      </CenterAlignedBox>
    );
  }
  return (
    <View style={props.style} className={styles.chatflow}>
      <ChatFramework {...chatProps} auth={chatProps.auth}>
        <ChatFlowSlot {...props} />
      </ChatFramework>
    </View>
  );
};
