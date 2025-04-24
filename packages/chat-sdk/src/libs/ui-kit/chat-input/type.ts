import { TaroStatic } from '@tarojs/taro';

import {
  type ChooseFileInfo,
  type AudioRaw,
  IOnTaskListChangeProps,
} from '@/libs/types';

export enum InputType {
  Text = 'text',
  Voice = 'voice',
}

export interface IChatInputProps {
  isNeedUpload?: boolean;
  isNeedTaskMessage?: boolean;
  defaultValue?: string;
  defaultInputType?: InputType;
  disabled?: boolean;
  taskList?: IOnTaskListChangeProps['taskList'];
  placeholder?: string;
  inputAdjustDefault?: boolean;
  isNeedAudio?: boolean;
  frameEventTarget?: InstanceType<TaroStatic['Events']>;
  isPcMode?: boolean;
  isFrameAutoFocus?: boolean;
  onKeyBoardHeightChange?: (height: number) => void;
  onSendTextMessage?: (text: string) => Promise<boolean | undefined>;
  onSendFileMessage?: (files: ChooseFileInfo[]) => Promise<boolean | undefined>;
  onSendAudioMessage?: (audio: AudioRaw) => Promise<boolean | undefined>;
  onAudioRecording?: (isRecording: boolean) => Promise<boolean | undefined>;
}

export interface ITaskMessage {
  isShow: boolean;
  options: string[];
}
