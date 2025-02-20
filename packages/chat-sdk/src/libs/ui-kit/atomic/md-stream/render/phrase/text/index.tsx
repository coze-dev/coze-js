import { FC, Fragment, useMemo } from 'react';

import type { Text as TextMdType } from 'mdast';
import cls from 'classnames';
import { Text as TaroText } from '@tarojs/components';

import { Break } from '../break';
import { useMdStreamSelectable } from '../../../context';

import styles from './index.module.less';
export const Text: FC<{
  node: TextMdType;
  className?: string;
}> = ({ node, className }) => {
  const textList = useMemo(() => node.value.split('\n'), [node.value]);
  const selectable = useMdStreamSelectable();
  return (
    <>
      {textList.map((item, index) => (
        <Fragment key={index}>
          {item ? (
            <TaroText
              selectable={selectable}
              className={cls(styles.text, styles.important, className)}
            >
              {item}
            </TaroText>
          ) : null}
          {index !== textList.length - 1 ? <Break /> : null}
        </Fragment>
      ))}
    </>
  );
};
