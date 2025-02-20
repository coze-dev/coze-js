import { FC } from 'react';

import { TaroStatic } from '@tarojs/taro';

import { SvgPlusCircle } from '@/libs/ui-kit/atomic/svg';
import { type ChooseFileInfo } from '@/libs/types';

import { Upload } from '../../atomic/upload';
import { IconButton } from '../../atomic/icon-button';
import { DisableContainer } from '../../atomic/disable-container';

import styles from './index.module.less';
// 文档：DOC、DOCX、XLS、XLSX、PPT、PPTX、PDF、Numbers、CSV
// 图片：JPG、JPG2、PNG、GIF、WEBP、HEIC、HEIF、BMP、PCD、TIFF
export const UploadBtn: FC<{
  onSendFileMessage?: (file: ChooseFileInfo[]) => void;
  disabled?: boolean;
  frameEventTarget?: InstanceType<TaroStatic['Events']>;
}> = ({ onSendFileMessage, frameEventTarget, disabled }) => (
  <DisableContainer disabled={disabled}>
    <Upload
      accept=".doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.numbers,.csv,.jpg,.jpg2,.png,.gif,.webp,.heic,.heif,.bmp,.pcd,.tiff,image/*"
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
