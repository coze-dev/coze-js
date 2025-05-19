import { FC, useMemo } from 'react';

import type { Link as LinkMdType } from 'mdast';
import cls from 'classnames';
import { setClipboardData, showToast } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { isWeb } from '@/libs/utils';

import { useMdStreamI18n, useMdStreamContext } from '../../../context';
import { Phrase } from '../';

import styles from './index.module.less';

export const Link: FC<{
  node: LinkMdType;
}> = ({ node }) => {
  const i18n = useMdStreamI18n();
  const { eventCallbacks } = useMdStreamContext();
  const isValidUrl = useMemo(() => {
    let isValid = node.url && node.url !== '#';
    if (node.url.startsWith('javascript:')) {
      isValid = false;
    }
    return isValid;
  }, [node.url]);
  return (
    <View
      onClick={e => {
        if (isValidUrl) {
          if (eventCallbacks?.onLinkClick) {
            eventCallbacks.onLinkClick(e, { url: node.url });
            return;
          }
          if (isWeb) {
            window.open(node.url);
          } else {
            setClipboardData({
              data: node.url,
              fail() {
                showToast({
                  title: i18n?.t('copyFailed') || '',
                  icon: 'error',
                });
              },
            });
          }
        }
      }}
      className={cls(styles.link, {
        [styles.invalid]: !isValidUrl,
      })}
    >
      {node.children.map((item, index) => (
        <Phrase key={index} node={item} />
      ))}
    </View>
  );
};
