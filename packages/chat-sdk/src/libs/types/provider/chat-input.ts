import type { IOnTaskListChangeProps } from '../base';

interface ChatInputAction {
  setTaskList: (props: IOnTaskListChangeProps) => void;
}

interface ChatInputState {
  taskList: IOnTaskListChangeProps['taskList'];
}

export type ChatInputStore = ChatInputAction & ChatInputState;
