import type { IOnTaskListChangeProps } from '../base';

interface ChatInputAction {
  setTaskList: (props: IOnTaskListChangeProps) => void;
  initSetInputValueFunc: (func: (value: string) => void) => void;
}

interface ChatInputState {
  taskList: IOnTaskListChangeProps['taskList'];
  setInputValue: (value: string) => void;
}

export type ChatInputStore = ChatInputAction & ChatInputState;
