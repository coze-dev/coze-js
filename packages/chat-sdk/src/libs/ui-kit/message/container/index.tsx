import { FC, PropsWithChildren } from 'react';

import { View, Text } from '@tarojs/components';

import { UserInfo } from '@/libs/types';

import { Spacing } from '../../atomic/spacing';
import { Avatar } from '../../atomic/avatar';
import AvatarImg from '../../assets/imgs/avatar.png';

import styles from './index.module.less';
export const MessageContainer: FC<
  PropsWithChildren<{
    senderInfo?: UserInfo;
    className?: string;
  }>
> = ({ children, senderInfo, className }) => (
  <Spacing gap={12} className={className}>
    <View>
      <Avatar src={senderInfo?.avatar || AvatarImg} size="medium" />
    </View>
    <Spacing vertical flex1 gap={5} className={styles.content}>
      {senderInfo?.name ? (
        <View>
          <Text
            numberOfLines={1}
            overflow="ellipsis"
            maxLines={1}
            className={styles.txt}
          >
            {senderInfo?.name}
          </Text>
        </View>
      ) : null}
      {children}
    </Spacing>
  </Spacing>
);
