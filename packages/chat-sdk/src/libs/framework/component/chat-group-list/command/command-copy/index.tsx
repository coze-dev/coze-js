import { FC } from 'react';

import cls from 'classnames';
import Taro from '@tarojs/taro';
import { Text } from '@tarojs/components';

import { setClipboardData, showToast } from '@/libs/utils';
import { SvgCopy } from '@/libs/ui-kit/atomic/svg';
import { DisableContainer } from '@/libs/ui-kit/atomic/disable-container';
import { IconButton, Spacing } from '@/libs/ui-kit';
import { UIEventType } from '@/libs/types';
import {
  useI18n,
  useUiEventStore,
} from '@/libs/provider/context/chat-store-context';

import styles from './index.module.less';
export const CommandCopy: FC<{
  text: string;
  isShowText?: boolean;
  svgTheme?: 'light' | 'dark' | 'gray-bold';
  isNeedHover?: boolean;
  className?: string;
}> = ({ text, isShowText, svgTheme, isNeedHover, className }) => {
  const targetEventCenter = useUiEventStore(store => store.event);
  const i18n = useI18n();
  return (
    <DisableContainer className={cls(styles.container, className)}>
      <Spacing
        width100
        onClick={event => {
          event.stopPropagation();
          Taro.eventCenter.trigger(UIEventType.FrameClick);
          setClipboardData({
            data: text,
            success(isUseWeb) {
              if (isUseWeb) {
                showToast(
                  {
                    content: i18n.t('copySuccess'),
                    icon: 'success',
                  },
                  targetEventCenter,
                );
              }
            },
            fail() {
              showToast(
                {
                  content: i18n.t('copyFailed'),
                  icon: 'error',
                },
                targetEventCenter,
              );
            },
          });
        }}
        gap={8}
      >
        <IconButton
          size="small"
          type="square-hover-btn"
          hoverTheme={isNeedHover ? 'hover' : 'none'}
        >
          <SvgCopy theme={svgTheme} />
        </IconButton>
        {isShowText ? (
          <Text
            className={styles.text}
            numberOfLines={1}
            maxLines={1}
            overflow="ellipsis"
          >
            {i18n.t('copyText')}
          </Text>
        ) : null}
      </Spacing>
    </DisableContainer>
  );
};
