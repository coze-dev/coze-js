import { useMemo } from 'react';

import { useUpdateEffect } from '@/libs/hooks';

import { IChatInputProps, InputType } from '../type';

interface IMultiModalMessageOptions {
  isRecording: boolean;
  inputType: InputType;
  setInputType?: (inputType: InputType) => void;
}

const useTaskMessage = (
  chatInputProps: IChatInputProps,
  options: IMultiModalMessageOptions,
) => {
  let isShowTaskMessage = false;
  const { inputType, setInputType, isRecording } = options;
  const { taskList, isNeedTaskMessage = false } = chatInputProps;

  const taskOptions = useMemo(() => {
    const taskOptionTemp: string[] = [];
    taskList?.map(item => {
      taskOptionTemp.push(...(item.taskValue || []));
    });
    return taskOptionTemp.filter(item => !!item);
  }, [taskList]);

  // Task messages are only visible in text mode.
  if (
    taskOptions.length > 0 &&
    inputType === InputType.Text &&
    isNeedTaskMessage
  ) {
    isShowTaskMessage = true;
  }

  //Updates the type of the input box to text when the task list changes.(Except audio is recording)
  useUpdateEffect(() => {
    // 当taskList有变化的时候，判断是否需要修改inputType
    if (!isRecording && inputType !== InputType.Text && isNeedTaskMessage) {
      setInputType?.(InputType.Text);
    }
  }, [taskList]);

  return {
    isShowTaskMessage,
    taskOptions,
  };
};

export const useMultiModeMessageHandle = (
  chatInputProps: IChatInputProps,
  options: IMultiModalMessageOptions,
) => {
  const { isShowTaskMessage, taskOptions } = useTaskMessage(
    chatInputProps,
    options,
  );
  const isShowMultiModeMessage = isShowTaskMessage; // We will continue to add more multi messages。

  return {
    taskMessage: {
      isShow: isShowTaskMessage,
      options: taskOptions,
    },
    isShowMultiModeMessage,
  };
};
