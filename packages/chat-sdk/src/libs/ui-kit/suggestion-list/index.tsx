import { FC } from 'react';

import cls from 'classnames';

import { Spacing } from '../atomic/spacing';
import { BubbleText } from '../atomic/bubble-text';

import styles from './index.module.less';
interface SuggestionList {
  suggestions: string[];
  isVertical?: boolean;
  isDisplayAll?: boolean;
  onClickSuggestion?: (suggestion: string) => void;
}

export const SuggestionList: FC<SuggestionList> = ({
  suggestions,
  onClickSuggestion,
  isVertical = true,
  isDisplayAll = false,
}) => (
  <Spacing
    gap={8}
    vertical={isVertical}
    className={cls(styles['suggestion-list'])}
  >
    {suggestions
      .slice(0, isDisplayAll ? suggestions.length : 3)
      .map((item, index) => (
        <BubbleText
          className={styles.suggestion}
          text={item}
          key={index}
          canClick={false}
          selectable={false}
          onClick={() => {
            onClickSuggestion?.(item);
          }}
        />
      ))}
  </Spacing>
);
