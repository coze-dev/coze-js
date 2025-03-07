import { FC } from 'react';

import { TaroStatic } from '@tarojs/taro';

import { SvgPlusCircle } from '@/libs/ui-kit/atomic/svg';
import { type ChooseFileInfo } from '@/libs/types';

import { Upload } from '../../atomic/upload';
import { IconButton } from '../../atomic/icon-button';
import { DisableContainer } from '../../atomic/disable-container';

import styles from './index.module.less';
const acceptType =
  '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.numbers,.csv,.jpg,.jpg2,.jpeg,.png,.gif,.webp,.heic,.heif,.bmp,.pcd,.tiff,.wav,.mp3,.flac,.m4a,.aac,.ogg,.wma,.midi,.mp4,.avi,.mov,.3gp,.3gpp,.flv,.webm,.wmv,.rmvb,.m4v,.mkv,.rar,.zip,.7z,.gz,.gzip,.bz2,.cpp,.py,.java,.c,image/*';
export const UploadBtn: FC<{
  onSendFileMessage?: (file: ChooseFileInfo[]) => void;
  disabled?: boolean;
  frameEventTarget?: InstanceType<TaroStatic['Events']>;
}> = ({ onSendFileMessage, frameEventTarget, disabled }) => (
  <DisableContainer disabled={disabled}>
    <Upload
      accept={acceptType}
      onChooseFile={item => {
        onSendFileMessage?.(item);
      }}
      frameEventTarget={frameEventTarget}
    >
      <IconButton hoverTheme={'hover'} type="circle-btn" border="none">
        <SvgPlusCircle className={styles['file-btn']} />
      </IconButton>
    </Upload>
  </DisableContainer>
);
