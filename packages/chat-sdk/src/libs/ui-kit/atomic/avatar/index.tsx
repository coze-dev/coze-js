import { useEffect, useState } from 'react';

import cls from 'classnames';

import { CImage } from '../c-image';
import AvatarImg from '../../assets/imgs/avatar.png';

import styles from './index.module.less';
interface AvatarProps {
  className?: string;
  src: string;
  size?: 'large' | 'medium' | 'small';
}
export const Avatar = ({ className, src, size = 'medium' }: AvatarProps) => {
  const [isError, setIsError] = useState(false);
  useEffect(() => {
    setIsError(false);
  }, [src]);
  return (
    <CImage
      src={isError ? AvatarImg : src}
      className={cls(styles.avatar, className, {
        [styles[size || '']]: true,
      })}
      onError={() => !isError && setIsError(true)}
      mode="aspectFill"
    />
  );
};
