import { FC, PropsWithChildren, useMemo } from 'react';

import { View, Text } from '@tarojs/components';

import { MessageWrapperConfig } from '@/libs/types/base/ui';
import { ChatMessageGroup, UserInfo } from '@/libs/types';

import { Spacing } from '../../atomic/spacing';
import { Avatar } from '../../atomic/avatar';
import AvatarImg from '../../assets/imgs/avatar.png';

import styles from './index.module.less';
export const MessageContainer: FC<
  PropsWithChildren<{
    senderInfo?: UserInfo;
    chatGroup?: ChatMessageGroup;
    isQuery?: boolean;
    className?: string;
    messageWrapperConf?: MessageWrapperConfig;
  }>
> = ({
  children,
  senderInfo,
  className,
  messageWrapperConf,
  isQuery,
  chatGroup,
}) => {
  const senderNameRightSlot = useMemo(
    () =>
      messageWrapperConf?.senderName?.renderRightSlot?.({
        isQuery,
        chatGroup,
      }),
    [isQuery, chatGroup, messageWrapperConf?.senderName?.renderRightSlot],
  );
  return (
    <Spacing gap={12} className={className}>
      <View>
        <Avatar src={senderInfo?.avatar || AvatarImg} size="medium" />
      </View>
      <Spacing vertical flex1 gap={5} className={styles.content}>
        {senderInfo?.name || senderNameRightSlot ? (
          <Spacing
            className={styles['sender-name-container']}
            width100
            verticalCenter
            gap={8}
          >
            {senderInfo?.name ? (
              <Text
                numberOfLines={1}
                overflow="ellipsis"
                maxLines={1}
                className={styles.txt}
              >
                {senderInfo?.name}
              </Text>
            ) : null}
            {senderNameRightSlot}
          </Spacing>
        ) : null}
        {children}
      </Spacing>
    </Spacing>
  );
};
