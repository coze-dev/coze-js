import { FileTypeEnum } from "@/libs/types";
const FILE_TYPE_CONFIG = [
  {
    fileType: FileTypeEnum.IMAGE,
    accept: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
    typeStart: "image/",
  },
  {
    fileType: FileTypeEnum.AUDIO,
    accept: [
      ".mp3",
      ".wav",
      ".aac",
      ".flac",
      ".ogg",
      ".wma",
      ".alac",
      ".mid",
      ".midi",
      ".ac3",
      ".dsd",
    ],
    typeStart: "audio/",
  },
  {
    fileType: FileTypeEnum.PDF,
    accept: [".pdf"],
  },
  {
    fileType: FileTypeEnum.DOCX,
    accept: [".docx", ".doc"],
  },
  {
    fileType: FileTypeEnum.EXCEL,
    accept: [".xls", ".xlsx"],
  },
  {
    fileType: FileTypeEnum.CSV,
    accept: [".csv"],
  },
  {
    fileType: FileTypeEnum.CODE,
    accept: [".py", ".java", ".c", ".cpp", ".js", ".html", ".css"],
  },
  {
    fileType: FileTypeEnum.VIDEO,
    accept: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".mkv"],
    typeStart: "audio/",
  },
  {
    fileType: FileTypeEnum.TXT,
    accept: [".txt"],
  },
  {
    fileType: FileTypeEnum.PPT,
    accept: [".ppt", ".pptx"],
  },
];

export const getFileTypeByFileName = (fileName: string) => {
  const fileInfo = FILE_TYPE_CONFIG.find(({ accept }) =>
    accept.some((ext) => fileName.endsWith(ext))
  );
  if (!fileInfo) {
    return FileTypeEnum.DEFAULT_UNKNOWN;
  }
  return fileInfo.fileType;
};

export const getFileTypeByFile = (file: File) => {
  const type = file.type;
  const fileName = file.name;
  const fileInfo = FILE_TYPE_CONFIG.find(({ accept, typeStart }) => {
    if (typeStart) {
      return type.startsWith(typeStart);
    } else if (accept) {
      return accept.some((ext) => fileName.endsWith(ext));
    }
  });
  if (!fileInfo) {
    return FileTypeEnum.DEFAULT_UNKNOWN;
  }
  return fileInfo.fileType;
};
