import { FC, PropsWithChildren, useState } from 'react';

import { View } from '@tarojs/components';

import styles from './index.module.less';
export const Modal: FC<
  PropsWithChildren<{
    onHide: () => void;
    isNeedMask?: boolean;
  }>
> = ({ children, onHide, isNeedMask = true }) => {
  const [isShow, setIsShow] = useState(true);
  if (!isShow) {
    return null;
  }
  return (
    <View className={styles['modal-container']}>
      {isNeedMask ? (
        <View
          className={styles.mask}
          onClick={() => {
            setIsShow(true);
            onHide();
          }}
        />
      ) : null}
      <View className={styles.modal}>{children}</View>
    </View>
  );
};
