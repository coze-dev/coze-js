import { FC, PropsWithChildren } from 'react';

import { View } from '@tarojs/components';

import { Spacing, Tooltip } from '@/libs/ui-kit';
import { ChatMessage } from '@/libs/types';
import { useIsMobile, useIsNeedTextToAudio } from '@/libs/provider';

import { CommandCopy } from '../command-copy';
import { CommandAudio } from '../command-audio';

import styles from './index.module.less';

export const CommandTooltip: FC<
  PropsWithChildren<{ message: ChatMessage; isActive?: boolean }>
> = ({ children, message, isActive }) => {
  const isMobile = useIsMobile();
  const content = !isMobile ? (
    <PcCommandContent message={message} />
  ) : (
    <MobileCommandContent message={message} />
  );
  const direction = !isMobile ? 'bottom' : 'top';
  return (
    <Tooltip
      content={content}
      type={!isMobile ? 'hover' : 'longtap'}
      isActive={
        message.content_type === 'text' && isActive && message.content !== ''
      }
      direction={direction}
    >
      {children}
    </Tooltip>
  );
};

const PcCommandContent: FC<{ message: ChatMessage }> = ({ message }) => {
  const isNeedTextToAudio = useIsNeedTextToAudio();
  return (
    <Spacing className={styles['pc-content']} gap={4}>
      {isNeedTextToAudio ? (
        <CommandContainer width={24}>
          <CommandAudio
            text={message.content}
            svgTheme="gray-bold"
            isNeedHover={true}
          />
        </CommandContainer>
      ) : null}
      <CommandContainer width={24}>
        <CommandCopy
          text={message.content}
          svgTheme="gray-bold"
          isNeedHover={true}
        />
      </CommandContainer>
    </Spacing>
  );
};
const MobileCommandContent: FC<{ message: ChatMessage }> = ({ message }) => {
  const isNeedTextToAudio = useIsNeedTextToAudio();
  return (
    <Spacing className={styles['mobile-content']} vertical>
      {isNeedTextToAudio ? (
        <CommandContainer width={100}>
          <CommandAudio
            text={message.content}
            svgTheme="gray-bold"
            isShowText={true}
            isNeedHover={true}
          />
        </CommandContainer>
      ) : null}
      <CommandContainer width={100}>
        <CommandCopy
          text={message.content}
          svgTheme="gray-bold"
          isShowText={true}
          isNeedHover={true}
        />
      </CommandContainer>
    </Spacing>
  );
};

const CommandContainer: FC<PropsWithChildren<{ width: number }>> = ({
  children,
  width,
}) => (
  <View
    style={{
      width: width || 24,
      height: 24,
    }}
  >
    {children}
  </View>
);
