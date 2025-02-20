import { FC } from 'react';

import cls from 'classnames';
import { chooseImage } from '@tarojs/taro';
import { Text } from '@tarojs/components';

import type { FileRaw } from '@/libs/types';
import { useI18n } from '@/libs/provider';

import { SvgImage, SvgCamera } from '../svg';
import { Spacing } from '../spacing';

import styles from './index.module.less';

interface TaroError {
  errNo: Number;
  errMsg: string;
}

const Chooser: FC<{
  svg: React.ReactNode;
  text: string;
  onClick?: () => void;
}> = ({ svg, text, onClick }) => (
  <Spacing vertical className={styles.chooser} gap={8} onClick={onClick}>
    {svg}
    <Text className={styles.text}>{text}</Text>
  </Spacing>
);

export const FileChooser: FC<{
  className?: string;
  onChooseFile?: (file: FileRaw) => void;
}> = ({ className, onChooseFile }) => {
  const i18n = useI18n();
  const onClick = async sourceType => {
    try {
      const res = await chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType,
      });
      if (res?.errMsg) {
        throw {
          errMsg: res.errMsg,
        };
      }
      onChooseFile?.({
        ...(res as FileRaw),
      });
    } catch (error) {
      const err = error as TaroError;
      if (err.errNo !== 10502 && !err.errMsg?.includes('cancel')) {
        /* showToast({
          content: i18n.t("chooseImageError"),
          icon: "error",
          duration: 3000,
        });*/
      }
    }
  };
  return (
    <Spacing className={cls(styles.container, className)} gap={8}>
      <Chooser
        svg={<SvgImage width={24} height={24} />}
        text={i18n.t('chooseImage')}
        onClick={() => {
          onClick(['album']);
        }}
      />
      <Chooser
        svg={<SvgCamera width={24} height={24} />}
        text={i18n.t('chooseCamera')}
        onClick={() => {
          onClick(['camera']);
        }}
      />
    </Spacing>
  );
};
