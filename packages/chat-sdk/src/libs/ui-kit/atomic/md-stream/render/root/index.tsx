import { FC, Fragment } from 'react';

import type { Root as RootType, BlockContent, PhrasingContent } from 'mdast';
import cls from 'classnames';
import { View } from '@tarojs/components';

import { Phrase, PhraseTypes } from '../phrase';
import { Block, BlockTypes } from '../block';

import './md.css';
import styles from './index.module.less';
export const Root: FC<{
  root?: RootType;
  theme?: 'dark' | 'light';
  className?: string;
  style?: React.CSSProperties;
}> = ({ root, theme = 'light', className, style }) => (
  <View
    style={style}
    className={cls(
      styles.root,
      'md-stream',
      {
        dark: theme !== 'dark',
      },
      className,
    )}
  >
    {root?.children.map((item, index) => (
      <Fragment key={index}>
        {BlockTypes.includes(item.type) && (
          <Block node={item as BlockContent} />
        )}
        {PhraseTypes.includes(item.type) && (
          <Phrase node={item as PhrasingContent} />
        )}
        {item.type === 'tableCell' && null /* 不做处理，做一个标记*/}
        {item.type === 'tableRow' && null /* 不做处理，做一个标记*/}
        {item.type === 'yaml' && null /* 不做处理，做一个标记*/}
      </Fragment>
    ))}
  </View>
);
