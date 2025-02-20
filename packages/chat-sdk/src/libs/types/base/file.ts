export enum FileTypeEnum {
  IMAGE = 'image',
  PDF = 'pdf',
  DOCX = 'docx',
  EXCEL = 'excel',
  CSV = 'csv',
  AUDIO = 'audio',
  VIDEO = 'video',
  TXT = 'txt',
  PPT = 'ppt',
  ZIP = 'zip',
  CODE = 'code',
  DEFAULT_UNKNOWN = 'default_unknown',
}

export type ChooseFileInfo =
  | {
      from: 'Taro_Image_Chooser'; // taro选择弃选择的文件
      type: FileTypeEnum; // 类型
      tempFilePath: string; // 临时文件地址，图片可用于预览，Taro
      size: number; // 文件大小
      file: {
        filePath: string;
      }; // Taro文件上传专用
    }
  | {
      from: 'H5_Input_Chooser'; // H5选择器选择的文件
      type: FileTypeEnum; // 类型
      tempFilePath: string; // 临时文件地址，图片可用于预览，Taro
      size: number; // 文件大小
      file: File;
    };
