import { FC } from 'react';

import { SvgFeishu } from '@/libs/ui-kit/atomic/svg';
import { DisableContainer } from '@/libs/ui-kit/atomic/disable-container';

import { IconButton } from '../../atomic/icon-button';

import styles from './index.module.less';

export const SendBtn: FC<{
  disabled?: boolean;
  focused?: boolean;
  onClick?: () => void;
}> = ({ disabled, onClick }) => (
  <DisableContainer disabled={disabled}>
    <IconButton
      hoverTheme={'hover'}
      onClick={onClick}
      type="circle-btn"
      border="none"
    >
      <SvgFeishu className={styles['send-btn']} theme={'dark'} />
    </IconButton>
  </DisableContainer>
);
