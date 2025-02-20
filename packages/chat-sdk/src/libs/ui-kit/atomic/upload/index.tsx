import { FC, PropsWithChildren, useRef, ChangeEvent } from 'react';

import Taro, { TaroStatic } from '@tarojs/taro';
import { View } from '@tarojs/components';

import { getFileTypeByFile, isWeb, logger, showToast } from '@/libs/utils';
import { ChooseFileInfo, FileTypeEnum } from '@/libs/types';

import styles from './index.module.less';

export const Upload: FC<
  PropsWithChildren<{
    onChooseFile?: (file: ChooseFileInfo[]) => void;
    accept?: string;
    frameEventTarget?: InstanceType<TaroStatic['Events']>;
  }>
> = ({ children, accept, onChooseFile, frameEventTarget }) => {
  const ref = useRef<HTMLInputElement>(null);
  const onWebInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (onChooseFile) {
      if (files && files.length > 0) {
        const fileInfos: ChooseFileInfo[] = [];
        for (const file of files) {
          const fileType = getFileTypeByFile(file);
          fileInfos.push({
            from: 'H5_Input_Chooser',
            type: fileType,
            size: file.size,
            file,
            tempFilePath: URL.createObjectURL(file),
          });
        }
        onChooseFile?.(fileInfos);
      } else {
        // 没有选中文件
      }
    }
    e.target.value = '';
  };
  return (
    <View className={styles.container}>
      {isWeb && (
        <input
          type="file"
          multiple={false}
          accept={accept}
          autoComplete="off"
          tabIndex={-1}
          className={styles.input}
          onChange={onWebInputFileChange}
          ref={ref}
        />
      )}
      <View
        onClick={() => {
          if (isWeb) {
            if (ref.current) {
              ref.current?.click?.();
            }
          } else {
            try {
              Taro.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sizeType: ['original', 'compressed'],
                sourceType: ['album', 'camera'],
                success(res) {
                  logger.debug('chooseMedia success:', res);
                  const fileInfos: ChooseFileInfo[] = res.tempFiles.map(
                    item => ({
                      from: 'Taro_Image_Chooser',
                      type:
                        // @ts-expect-error -- linter-disable-autofix
                        item.fileType === 'image' || item.mediaType === 'image'
                          ? FileTypeEnum.IMAGE
                          : FileTypeEnum.VIDEO,
                      size: item.size,
                      tempFilePath: item.tempFilePath,
                      file: {
                        filePath: item.tempFilePath,
                      },
                    }),
                  );
                  onChooseFile?.(fileInfos);
                },
                fail(res) {
                  logger.error('chooseMedia fail:', res);
                  if (res.errMsg.includes('cancel')) {
                    return;
                  } else {
                    showToast(
                      {
                        content: `选择文件失败: ${res.errMsg}`,
                        icon: 'error',
                      },
                      frameEventTarget,
                    );
                  }
                },
              });
            } catch (error) {
              logger.error('chooseMedia error:', error);
            }
          }
        }}
      >
        {children}
      </View>
    </View>
  );
};
