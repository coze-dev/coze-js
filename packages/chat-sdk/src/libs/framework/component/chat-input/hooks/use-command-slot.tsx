import { logger } from '@/libs/utils';
import { UiCommandPosition } from '@/libs/types';
import { useChatPropsStore, useThemeType } from '@/libs/provider';

import { DeleteMessage } from '../delete-message';
import { ClearContext } from '../clear-context';

export const useCommandSlot = (position: UiCommandPosition) => {
  const ui = useChatPropsStore(store => store.ui);
  const clearContextConfig = Object.assign(
    { isNeed: true, position: 'inputLeft', SlotComponent: ClearContext },
    ui?.chatSlot?.clearContext || {},
  );
  const uiTheme = useThemeType();
  const clearMessageConfig = Object.assign(
    { isNeed: true, position: 'headerRight', SlotComponent: DeleteMessage },
    ui?.chatSlot?.clearMessage || {},
  );
  logger.debug('useCommandSlot', {
    clearContextConfig,
    clearMessageConfig,
    position,
    ui,
  });
  return [clearContextConfig, clearMessageConfig]
    .filter(item => item.isNeed && item.position === position)
    .map(({ position: positionItem, SlotComponent }) =>
      positionItem === 'headerRight' ? (
        <SlotComponent
          type="square-hover-btn"
          svgTheme={uiTheme === 'bg-theme' ? 'light' : 'dark'}
        />
      ) : (
        <SlotComponent svgTheme={'dark'} />
      ),
    );
};
