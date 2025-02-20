import { useRef } from 'react';

import { Logger } from '@/libs/utils';
import { type IOnTaskListChange } from '@/libs/types';
import { usePersistCallback } from '@/libs/hooks';

import { TaskValue } from '../ast';
export const useTaskChangeHandle = ({
  onTaskChange,
  logger,
}: {
  onTaskChange?: IOnTaskListChange;
  logger?: Logger;
}) => {
  const refList = useRef<Record<string, TaskValue>>({});

  const onTaskChangeHandle = usePersistCallback((taskValue: TaskValue) => {
    refList.current[taskValue.id] = taskValue;
    const taskList = Object.values(refList.current)
      .sort((prev, next) => prev.index - next.index)
      .map(item => ({
        taskName: item.id,
        taskValue: item.values,
      }));
    onTaskChange?.({
      taskList,
    });
    logger?.debug('useTaskChangeHandle onTaskChange values:', taskList);
  });
  return { onTaskChangeHandle };
};
