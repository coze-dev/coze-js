import { type FC } from 'react';

import { type Table as TableNode } from 'mdast';
import classNames from 'classnames';
import { View } from '@tarojs/components';

import { Phrase } from '../../phrase';

import styles from './index.module.less';

export const Table: FC<{ node: TableNode }> = ({ node }) => (
  <View className={styles['table-wrapper']}>
    <View className={styles.table}>
      {node.children.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          className={classNames(styles['table-row'], {
            [styles['table-header']]: rowIndex === 0,
          })}
        >
          {row.children.map((cell, cellIndex) => (
            <View
              key={`row-${rowIndex}-cell-${cellIndex}`}
              className={styles['table-cell']}
            >
              {cell.children.map((item, index) => (
                <Phrase
                  key={`row-${rowIndex}-cell-${cellIndex}-content-${index}`}
                  node={item}
                />
              ))}
            </View>
          ))}
        </View>
      ))}
    </View>
  </View>
);
