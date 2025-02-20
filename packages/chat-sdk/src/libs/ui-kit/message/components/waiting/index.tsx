import { Waiting } from '../../../atomic/waiting';
import { Bubble } from '../../../atomic/bubble';

import styles from './index.module.less';
export const WaitingMessage = () => (
  <Bubble isNeedBorder={false} className={styles.waiting}>
    <Waiting />
  </Bubble>
);
