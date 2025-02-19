import { FC } from "react";

import cls from "classnames";
import { Image } from "@tarojs/components";
import type { SvgProps } from "./type";
import { FileTypeEnum } from "@/libs/types";

import SvgWarnRaw from "../../assets/svg/warn.svg";
import SvgPlusRaw from "../../assets/svg/plus.svg";
import SvgLoadingRaw from "../../assets/svg/loading.svg";
import SvgImageRaw from "../../assets/svg/image.svg";
import SvgFileZipRaw from "../../assets/svg/file-type/zip.svg";
import SvgFileXlsxRaw from "../../assets/svg/file-type/xlsx.svg";
import SvgFileVideoRaw from "../../assets/svg/file-type/video.svg";
import SvgFileTxtRaw from "../../assets/svg/file-type/txt.svg";
import SvgFilePptxRaw from "../../assets/svg/file-type/pptx.svg";
import SvgFilePdfRaw from "../../assets/svg/file-type/pdf.svg";
import SvgFileOtherRaw from "../../assets/svg/file-type/other.svg";
import SvgFileDocxRaw from "../../assets/svg/file-type/docx.svg";
import SvgFileCsxRaw from "../../assets/svg/file-type/csv.svg";
import SvgFileCodeRaw from "../../assets/svg/file-type/code.svg";
import SvgFileAudioRaw from "../../assets/svg/file-type/audio.svg";
import SvgCameraRaw from "../../assets/svg/camera.svg";
import SvgErrorRaw from "../../assets/svg/error.svg";
import SvgCloseRaw from "../../assets/svg/close.svg";
import SvgErrorFillRaw from "../../assets/svg/error-fill.svg";
import SvgSuccessFillRaw from "../../assets/svg/success-fill.svg";
import SvgCheckMarkRaw from "../../assets/svg/check-mark.svg";
import SvgArrowUpRaw from "../../assets/svg/arrow-up.svg";
import SvgKeyboardRaw from "../../assets/imgs/keyboard.png";
import SvgMicrophoneRaw from "../../assets/svg/microphone.svg";
import SvgInfoRaw from "../../assets/svg/info.svg";
import SvgCancelRaw from "../../assets/imgs/cancel.png";
import SvgAudioArrowUpRaw from "../../assets/imgs/arrow-up.png";

import SvgConversationRaw from "../../assets/svg/conversation.svg";

import { useBroomSvg } from "./hooks/use-broom-svg";
import { useCopySvg } from "./hooks/use-copy.svg";
import { useFeishuSvg } from "./hooks/use-feishu-svg";
import styles from "./index.module.less";

export const Svg: FC<SvgProps> = ({ src, className, ...rest }) => (
  <Image {...rest} src={src} svg className={cls(styles.svg, className)} />
);

export const SvgLoading = (props) => <Svg {...props} src={SvgLoadingRaw} />;
export const SvgBroom = (props) => {
  const svgRaw = useBroomSvg(props);
  return <Svg {...props} src={svgRaw} />;
};
export const SvgConversation = (props) => (
  <Svg {...props} src={SvgConversationRaw} />
);

export const SvgFeishu = (props) => {
  const svgRaw = useFeishuSvg(props);
  return <Svg {...props} src={svgRaw} />;
};

export const SvgPlusCircle = ({ className, ...props }) => (
  <Svg {...props} src={SvgPlusRaw} className={cls(styles.circle, className)} />
);

export const SvgImage = (props) => <Svg {...props} src={SvgImageRaw} />;
export const SvgCamera = (props) => <Svg {...props} src={SvgCameraRaw} />;
export const SvgWarn = (props) => <Svg {...props} src={SvgWarnRaw} />;

export const SvgError = (props) => <Svg {...props} src={SvgErrorRaw} />;
export const SvgClose = (props) => <Svg {...props} src={SvgCloseRaw} />;

export const SvgErrorFill = (props) => <Svg {...props} src={SvgErrorFillRaw} />;
export const SvgSuccessFill = (props) => (
  <Svg {...props} src={SvgSuccessFillRaw} />
);
export const SvgCheckMark = (props) => <Svg {...props} src={SvgCheckMarkRaw} />;
export const SvgArrowUp = (props) => <Svg {...props} src={SvgArrowUpRaw} />;
export const SvgInfo = (props) => <Svg {...props} src={SvgInfoRaw} />;

export const SvgKeyboard = (props) => <Svg {...props} src={SvgKeyboardRaw} />;
export const SvgMicrophone = (props) => (
  <Svg {...props} src={SvgMicrophoneRaw} />
);
export const SvgCopy = (props) => {
  const svgRaw = useCopySvg(props);
  return <Svg {...props} src={svgRaw} />;
};

export const SvgAudioArrowUp = (props) => (
  <Svg {...props} src={SvgAudioArrowUpRaw} />
);
export const SvgCancel = (props) => <Svg {...props} src={SvgCancelRaw} />;

const FILE_SVG_MAP = {
  [FileTypeEnum.AUDIO]: SvgFileAudioRaw,
  [FileTypeEnum.VIDEO]: SvgFileVideoRaw,
  [FileTypeEnum.ZIP]: SvgFileZipRaw,
  [FileTypeEnum.PDF]: SvgFilePdfRaw,
  [FileTypeEnum.DOCX]: SvgFileDocxRaw,
  [FileTypeEnum.EXCEL]: SvgFileXlsxRaw,
  [FileTypeEnum.CSV]: SvgFileCsxRaw,
  [FileTypeEnum.PPT]: SvgFilePptxRaw,
  [FileTypeEnum.TXT]: SvgFileTxtRaw,
  [FileTypeEnum.CODE]: SvgFileCodeRaw,
  [FileTypeEnum.DEFAULT_UNKNOWN]: SvgFileOtherRaw,
};
export const SvgFileType: FC<
  Omit<SvgProps, "src"> & { type: FileTypeEnum }
> = ({ type, ...rest }) => <Svg {...rest} src={FILE_SVG_MAP[type]} />;
