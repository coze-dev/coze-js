import { describe, expect, test } from 'vitest';

import {
  getFileTypeByFile,
  getFileTypeByFileName,
} from '../../../src/libs/utils/get-file-type';
import { FileTypeEnum } from '../../../src/libs/types';

describe('utils/get-file-type', () => {
  test('getFileTypeByFileName', () => {
    const fileType = getFileTypeByFileName('test.txt');
    expect(fileType).toBe(FileTypeEnum.TXT);
  });

  test('getFileTypeByFile', () => {
    const fileType = getFileTypeByFile(
      new File([], 'test.txt', {
        type: 'image/jpeg',
      }),
    );
    expect(fileType).toBe(FileTypeEnum.IMAGE);
  });

  test('getFileTypeByFileName_Unknown', () => {
    const fileType = getFileTypeByFileName('test.asdfasf');
    expect(fileType).toBe(FileTypeEnum.DEFAULT_UNKNOWN);
  });

  test('getFileTypeByFile_Unknown', () => {
    const fileType = getFileTypeByFile(
      new File([], 'test.asdfasdfasdf', {
        type: 'imagesafas/jpeg',
      }),
    );
    expect(fileType).toBe(FileTypeEnum.DEFAULT_UNKNOWN);
  });
});
