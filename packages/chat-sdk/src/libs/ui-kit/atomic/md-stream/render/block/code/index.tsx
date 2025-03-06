import { FC, Fragment, useMemo } from 'react';

import cls from 'classnames';
import { showToast } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { setClipboardData } from '@/libs/utils';

import { Text } from '../../phrase/text';
import { Indicator } from '../../phrase/indicator';
import {
  useMdStreamEnableCodeBy4Space,
  useMdStreamGetMarkdown,
  useMdStreamI18n,
} from '../../../context';
import type { CodeLocal } from '../../../ast';

import styles from './index.module.less';

export const Code: FC<{
  node: CodeLocal;
}> = ({ node }) => {
  const i18n = useMdStreamI18n();
  const children = node?.children?.length
    ? node?.children
    : [
        {
          type: 'text',
          value: node.value,
        },
      ];
  const enableCodeBy4Space = useMdStreamEnableCodeBy4Space();
  const markdown = useMdStreamGetMarkdown();
  const isShowCode = useMemo(() => {
    if (enableCodeBy4Space) {
      return true;
    }
    const offset = node.position?.start.offset || 0;
    if (!node.position?.start.offset && node.position?.start.offset !== 0) {
      return true;
    } else if (markdown.substring(offset, offset + 4) === '    ') {
      return false;
    }
    return true;
  }, [enableCodeBy4Space, markdown, node.position?.start.offset]);
  return (
    <View
      className={cls(styles['code-container'], {
        [styles.code]: isShowCode,
      })}
    >
      <View className={styles.header}>
        <View className={styles.lang}>{node.lang}</View>
        <View
          className={styles.copy}
          onClick={() => {
            setClipboardData({
              data: node.value,
              fail() {
                showToast({
                  title: i18n?.t('copyFailed') || '',
                  icon: 'error',
                });
              },
            });
          }}
        >
          {i18n?.t('copyCode')}
        </View>
      </View>
      <View className={styles.content}>
        {children?.map((item, index) => (
          <Fragment key={index}>
            {item.type === 'text' && (
              <Text node={item} className={styles.text} />
            )}
            {item.type === 'indicator' && <Indicator node={item} />}
          </Fragment>
        ))}
      </View>
    </View>
  );
};
